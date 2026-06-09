'use client';

import { useState, useEffect, useMemo, useCallback } from 'react';
import { supabase } from '@/lib/supabase';
import { MemberPopup } from './member-popup';

interface Member { id: string; first_name: string; last_name: string; gender: string; blood_group?: string; profession?: string; profile_image?: string; }
interface Relation { id: string; member_id: string; related_member_id: string; relationship_type: string; }

export function FamilyTree() {
  const [members, setMembers] = useState<Member[]>([]);
  const [relationships, setRelationships] = useState<Relation[]>([]);
  const [popupId, setPopupId] = useState<string | null>(null);
  const [scale, setScale] = useState(1);
  const [pos, setPos] = useState({ x: 0, y: 0 });
  const [dragging, setDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      supabase.from('members').select('id,first_name,last_name,gender,blood_group,profession,profile_image').neq('status', 'deleted'),
      supabase.from('member_relationships').select('*'),
    ]).then(([m, r]) => {
      setMembers((m.data as any) ?? []); setRelationships((r.data as any) ?? []); setLoading(false);
    });
  }, []);

  const NODE_W = 170; const NODE_H = 90; const LEVEL_H = 150; const H_GAP = 40; const INITIAL_PADDING = 60;

  const { tree, nodes, bounds } = useMemo(() => {
    if (!members.length) return { tree: [], nodes: [], bounds: { minX: 0, maxX: 800, minY: 0, maxY: 600 } };

    const memberMap = new Map(members.map(m => [m.id, m]));
    const visited = new Set<string>();

    // Who is a child of someone?
    const childIds = new Set(relationships.filter(r => r.relationship_type === 'child').map(r => r.related_member_id));
    // Who is a spouse of someone?
    const spouseMap = new Map<string, string>();
    relationships.filter(r => r.relationship_type === 'spouse').forEach(r => { spouseMap.set(r.member_id, r.related_member_id); spouseMap.set(r.related_member_id, r.member_id); });

    // Find roots: members who have children (are parents) but are NOT children of anyone
    const parentIds = new Set(relationships.filter(r => r.relationship_type === 'father' || r.relationship_type === 'mother').map(r => r.related_member_id));
    const roots = [...parentIds].filter(id => !childIds.has(id)).map(id => memberMap.get(id)).filter(Boolean) as Member[];

    // If no roots found, use all members who have any relationships
    const hasRel = new Set(relationships.flatMap(r => [r.member_id, r.related_member_id]));
    const connectedMembers = roots.length > 0 ? roots : members.filter(m => hasRel.has(m.id));
    
    // For each root, find children (people who list this member as father/mother)
    const getChildren = (memberId: string) => {
      const parentRels = relationships.filter(r =>
        (r.relationship_type === 'father' || r.relationship_type === 'mother') && r.related_member_id === memberId
      );
      return parentRels.map(r => memberMap.get(r.member_id)).filter(Boolean) as Member[];
    };

    const getSpouse = (memberId: string): Member | undefined => {
      const relId = spouseMap.get(memberId);
      return relId ? memberMap.get(relId) : undefined;
    };

    const allNodes: Array<{ member: Member; spouse?: Member; x: number; y: number }> = [];

    const layout = (member: Member, level: number, offset: number, isSpouse: boolean = false): number => {
      if (visited.has(member.id)) return offset;
      visited.add(member.id);

      const children = getChildren(member.id);
      let currentOffset = offset;

      // Layout children first to know their total width
      const childWidths: number[] = [];
      let totalChildWidth = 0;
      for (const child of children) {
        const w = layout(child, level + 1, currentOffset);
        childWidths.push(w - currentOffset);
        totalChildWidth += w - currentOffset + H_GAP;
        currentOffset = w + H_GAP;
      }
      if (childWidths.length > 0) totalChildWidth -= H_GAP;

      // Position this member centered over its children
      const x = children.length > 0
        ? (allNodes.find(n => n.member.id === children[0].id)!.x + (allNodes.find(n => n.member.id === children[children.length - 1].id)!.x - allNodes.find(n => n.member.id === children[0].id)!.x) / 2)
        : offset * (NODE_W + H_GAP);

      const y = level * LEVEL_H;
      const spouse = isSpouse ? undefined : getSpouse(member.id);

      allNodes.push({ member, spouse, x, y });

      if (spouse && !visited.has(spouse.id)) {
        allNodes.push({ member: spouse, x: x + NODE_W + H_GAP / 2, y });
        visited.add(spouse.id);
      }

      return Math.max(currentOffset, x + NODE_W + (spouse ? NODE_W + H_GAP / 2 : 0));
    };

    connectedMembers.forEach((m, i) => { if (!visited.has(m.id)) layout(m, 0, i); });

    // Calculate bounds
    let minX = Infinity, maxX = -Infinity, minY = Infinity, maxY = -Infinity;
    allNodes.forEach(n => {
      minX = Math.min(minX, n.x); maxX = Math.max(maxX, n.x + NODE_W);
      minY = Math.min(minY, n.y); maxY = Math.max(maxY, n.y + NODE_H);
    });

    return { tree: connectedMembers, nodes: allNodes, bounds: { minX: minX - INITIAL_PADDING, maxX: maxX + INITIAL_PADDING, minY: minY - INITIAL_PADDING, maxY: maxY + INITIAL_PADDING } };
  }, [members, relationships]);

  const handleWheel = useCallback((e: React.WheelEvent) => {
    e.preventDefault(); setScale(s => Math.max(0.15, Math.min(4, s + (e.deltaY > 0 ? -0.15 : 0.15))));
  }, []);

  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    if (e.target === e.currentTarget || (e.target as HTMLElement).tagName === 'svg') {
      setDragging(true); setDragStart({ x: e.clientX - pos.x, y: e.clientY - pos.y });
    }
  }, [pos]);

  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    if (dragging) setPos({ x: e.clientX - dragStart.x, y: e.clientY - dragStart.y });
  }, [dragging, dragStart]);

  if (loading) return <div className="card" style={{ padding: '3rem', textAlign: 'center' }}><p style={{ color: 'var(--color-text-muted)' }}>Loading tree...</p></div>;
  if (nodes.length === 0) return <div className="card" style={{ padding: '3rem', textAlign: 'center' }}><p style={{ color: 'var(--color-text-muted)' }}>No relationships found. Add relationships from member profiles to build the family tree.</p></div>;

  const viewW = bounds.maxX - bounds.minX;
  const viewH = bounds.maxY - bounds.minY;

  return (
    <div>
      <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '0.75rem' }}>
        <button onClick={() => setScale(s => Math.min(4, s + 0.2))} className="btn btn-outline btn-sm" title="Zoom in">🔍+</button>
        <button onClick={() => setScale(s => Math.max(0.15, s - 0.2))} className="btn btn-outline btn-sm" title="Zoom out">🔍-</button>
        <button onClick={() => { setScale(1); setPos({ x: 0, y: 0 }); }} className="btn btn-ghost btn-sm">↺ Reset</button>
        <span style={{ fontSize: 'var(--font-size-xs)', color: 'var(--color-text-muted)', padding: '0.375rem 0', marginLeft: 'auto' }}>{nodes.length} people in tree</span>
      </div>

      <div
        onWheel={handleWheel} onMouseDown={handleMouseDown} onMouseMove={handleMouseMove}
        onMouseUp={() => setDragging(false)} onMouseLeave={() => setDragging(false)}
        style={{ position: 'relative', overflow: 'hidden', height: 550, border: '2px dashed var(--color-border)', borderRadius: 'var(--radius-lg)', cursor: dragging ? 'grabbing' : 'grab', background: 'var(--color-bg)' }}
      >
        <div style={{ transform: `translate(${pos.x}px, ${pos.y}px) scale(${scale})`, transformOrigin: '0 0', position: 'absolute', top: 0, left: 0 }}>
          <svg width={viewW + 200} height={viewH + 200}>
            {nodes.map(n => {
              const isSpouse = nodes.some(other => other.spouse?.id === n.member.id);
              return (
                <g key={n.member.id} style={{ cursor: 'pointer' }} onClick={() => setPopupId(n.member.id)}>
                  {/* Node background */}
                  <rect x={n.x - bounds.minX} y={n.y - bounds.minY} width={NODE_W} height={NODE_H} rx="10" fill="white" stroke={isSpouse ? 'var(--color-accent)' : 'var(--color-primary)'} strokeWidth="2.5" filter="drop-shadow(0 2px 4px rgba(0,0,0,0.08))" />
                  
                  {/* Avatar */}
                  <clipPath id={`clip-${n.member.id}`}><rect x={n.x - bounds.minX + 10} y={n.y - bounds.minY + 10} width="38" height="38" rx="19" /></clipPath>
                  {n.member.profile_image ? (
                    <image href={n.member.profile_image} x={n.x - bounds.minX + 10} y={n.y - bounds.minY + 10} width="38" height="38" clipPath={`url(#clip-${n.member.id})`} preserveAspectRatio="xMidYMid slice" />
                  ) : (
                    <>
                      <circle cx={n.x - bounds.minX + 29} cy={n.y - bounds.minY + 29} r="19" fill="var(--color-primary)" opacity="0.15" />
                      <text x={n.x - bounds.minX + 29} y={n.y - bounds.minY + 34} textAnchor="middle" fill="var(--color-primary)" fontSize="14" fontWeight="700">{n.member.first_name?.[0]}{n.member.last_name?.[0]}</text>
                    </>
                  )}

                  {/* Name + info */}
                  <text x={n.x - bounds.minX + 56} y={n.y - bounds.minY + 28} fill="var(--color-text)" fontSize="13" fontWeight="700">{n.member.first_name} {n.member.last_name}</text>
                  <text x={n.x - bounds.minX + 56} y={n.y - bounds.minY + 46} fill="var(--color-text-muted)" fontSize="10" className="capitalize">{n.member.gender}{n.member.blood_group ? ` · ${n.member.blood_group}` : ''}</text>
                  {n.member.profession ? (
                    <text x={n.x - bounds.minX + 56} y={n.y - bounds.minY + 61} fill="var(--color-text-muted)" fontSize="9">{n.member.profession}</text>
                  ) : null}
                  <text x={n.x - bounds.minX + 56} y={n.y - bounds.minY + (n.member.profession ? 76 : 61)} fill="var(--color-accent)" fontSize="9">More info →</text>

                  {/* Spouse connector + spouse marker */}
                  {isSpouse && (
                    <text x={n.x - bounds.minX + NODE_W / 2} y={n.y - bounds.minY - 6} textAnchor="middle" fill="var(--color-accent)" fontSize="9" fontWeight="600">Spouse</text>
                  )}
                </g>
              );
            })}

            {/* Connection lines between parents and children */}
            {nodes.map(n => {
              const children = nodes.filter(child => {
                const parentRel = relationships.find(r =>
                  (r.relationship_type === 'father' || r.relationship_type === 'mother') &&
                  r.related_member_id === n.member.id && r.member_id === child.member.id
                );
                return !!parentRel;
              });
              if (children.length === 0) return null;

              const parentCX = n.x - bounds.minX + NODE_W / 2;
              const parentBottom = n.y - bounds.minY + NODE_H;
              const childrenAvgX = children.reduce((sum, c) => sum + c.x, 0) / children.length - bounds.minX + NODE_W / 2;
              const firstChildY = children[0].y - bounds.minY;

              return (
                <g key={`lines-${n.member.id}`}>
                  <line x1={parentCX} y1={parentBottom} x2={parentCX} y2={(parentBottom + firstChildY) / 2} stroke="var(--color-border)" strokeWidth="2" />
                  <line x1={Math.min(...children.map(c => c.x - bounds.minX + NODE_W / 2))} y1={(parentBottom + firstChildY) / 2} x2={Math.max(...children.map(c => c.x - bounds.minX + NODE_W / 2))} y2={(parentBottom + firstChildY) / 2} stroke="var(--color-border)" strokeWidth="2" />
                  {children.map(c => (
                    <line key={`child-${c.member.id}`} x1={c.x - bounds.minX + NODE_W / 2} y1={(parentBottom + firstChildY) / 2} x2={c.x - bounds.minX + NODE_W / 2} y2={firstChildY} stroke="var(--color-border)" strokeWidth="2" />
                  ))}
                </g>
              );
            })}
          </svg>
        </div>
      </div>

      {popupId && <MemberPopup memberId={popupId} onClose={() => setPopupId(null)} />}
    </div>
  );
}
