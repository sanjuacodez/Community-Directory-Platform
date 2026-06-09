'use client';

import { useState, useCallback, useMemo } from 'react';
import { MemberPopup } from './member-popup';

interface Member {
  id: string; first_name: string; last_name: string; gender: string;
  blood_group?: string; profession?: string; location?: string; profile_image?: string;
}

interface Relation { member_id: string; related_member_id: string; relationship_type: string; }

interface TreeNode {
  id: string; member: Member; spouse?: Member;
  children: TreeNode[]; level: number; index: number;
}

export function FamilyTree({ members, relationships }: { members: Member[]; relationships: Relation[] }) {
  const [scale, setScale] = useState(1); const [pos, setPos] = useState({ x: 0, y: 0 });
  const [dragging, setDragging] = useState(false); const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [popupId, setPopupId] = useState<string | null>(null);

  const tree = useMemo(() => {
    const memberMap = new Map(members.map(m => [m.id, m]));
    const childSet = new Set(relationships.filter(r => r.relationship_type === 'child').map(r => r.related_member_id));
    const parentSet = new Set(relationships.filter(r => r.relationship_type === 'father' || r.relationship_type === 'mother').map(r => r.related_member_id));

    // Roots: people who are parents but NOT children of anyone in our data
    const roots = [...parentSet].filter(id => !childSet.has(id)).map(id => memberMap.get(id)).filter(Boolean) as Member[];
    const visited = new Set<string>();

    const getSpouse = (memberId: string): Member | undefined => {
      const rel = relationships.find(r => r.member_id === memberId && r.relationship_type === 'spouse');
      return rel ? memberMap.get(rel.related_member_id) : undefined;
    };

    const getChildren = (memberId: string): Member[] => {
      return relationships
        .filter(r => r.member_id === memberId && r.relationship_type === 'child')
        .map(r => memberMap.get(r.related_member_id))
        .filter(Boolean) as Member[];
    };

    const buildNode = (member: Member, level: number, index: number): TreeNode | null => {
      if (visited.has(member.id)) return null;
      visited.add(member.id);
      const spouse = getSpouse(member.id);
      const children = getChildren(member.id);
      return {
        id: member.id, member, level, index,
        spouse: spouse ? { ...spouse } : undefined,
        children: children.map((c, i) => buildNode(c, level + 1, i)).filter(Boolean) as TreeNode[],
      };
    };

    return roots.map((r, i) => buildNode(r, 0, i)).filter(Boolean) as TreeNode[];
  }, [members, relationships]);

  if (tree.length === 0) {
    return <div className="card" style={{ padding: '3rem', textAlign: 'center' }}>
      <p style={{ color: 'var(--color-text-muted)' }}>No family relationships to display. Add relationships from member profiles.</p>
    </div>;
  }

  const NODE_W = 160; const NODE_H = 80; const LEVEL_H = 130; const SIBLING_GAP = 60;

  const renderLines = (node: TreeNode, px: number, py: number): React.ReactNode[] => {
    const lines: React.ReactNode[] = [];
    const children = node.children;
    if (children.length === 0) return lines;

    const totalWidth = children.length * (NODE_W + SIBLING_GAP) - SIBLING_GAP;
    const startX = px - totalWidth / 2 + NODE_W / 2;
    const parentCenterX = px;
    const parentBottom = py + NODE_H;

    children.forEach((child, i) => {
      const cx = startX + i * (NODE_W + SIBLING_GAP);
      const cy = py + LEVEL_H;
      const childTop = cy;
      const midY = (parentBottom + childTop) / 2;
      lines.push(
        <g key={`lines-${child.id}`}>
          <line x1={parentCenterX} y1={parentBottom} x2={parentCenterX} y2={midY} stroke="var(--color-border)" strokeWidth="1.5" />
          <line x1={parentCenterX} y1={midY} x2={cx} y2={midY} stroke="var(--color-border)" strokeWidth="1.5" />
          <line x1={cx} y1={midY} x2={cx} y2={childTop} stroke="var(--color-border)" strokeWidth="1.5" />
        </g>
      );
      lines.push(...renderLines(child, cx, cy));
    });
    return lines;
  };

  const renderNode = (node: TreeNode, x: number, y: number): React.ReactNode[] => {
    const nodes: React.ReactNode[] = [];
    const m = node.member;
    nodes.push(
      <g key={node.id}>
        <rect x={x - NODE_W / 2} y={y} width={NODE_W} height={NODE_H} rx="8" fill="var(--color-surface)" stroke="var(--color-border)" strokeWidth="2" style={{ cursor: 'pointer' }} onClick={() => setPopupId(m.id)} />
        {m.profile_image ? (
          <clipPath id={`clip-${m.id}`}><rect x={x - NODE_W / 2 + 8} y={y + 8} width="28" height="28" rx="14" /></clipPath>
        ) : null}
        {m.profile_image ? (
          <image href={m.profile_image} x={x - NODE_W / 2 + 8} y={y + 8} width="28" height="28" clipPath={`url(#clip-${m.id})`} preserveAspectRatio="xMidYMid slice" />
        ) : (
          <>
            <circle cx={x - NODE_W / 2 + 22} cy={y + 22} r="14" fill="var(--color-primary)" />
            <text x={x - NODE_W / 2 + 22} y={y + 26} textAnchor="middle" fill="white" fontSize="10" fontWeight="bold">{m.first_name?.[0]}{m.last_name?.[0]}</text>
          </>
        )}
        <text x={x - NODE_W / 2 + 44} y={y + 18} fill="var(--color-text)" fontSize="11" fontWeight="600">{m.first_name} {m.last_name}</text>
        <text x={x - NODE_W / 2 + 44} y={y + 33} fill="var(--color-text-muted)" fontSize="9" className="capitalize">{m.gender}{m.blood_group ? ` · ${m.blood_group}` : ''}</text>
        {m.profession && <text x={x - NODE_W / 2 + 44} y={y + 47} fill="var(--color-text-muted)" fontSize="8">{m.profession}</text>}
        <text x={x - NODE_W / 2 + 44} y={m.profession ? y + 60 : y + 47} fill="var(--color-accent)" fontSize="8">More info →</text>
      </g>
    );

    const totalWidth = node.children.length * (NODE_W + SIBLING_GAP) - SIBLING_GAP;
    const startX = x - totalWidth / 2 + NODE_W / 2;
    node.children.forEach((child, i) => {
      nodes.push(...renderNode(child, startX + i * (NODE_W + SIBLING_GAP), y + LEVEL_H));
    });

    // Spouse
    if (node.spouse && !node.children.some(c => c.id === node.spouse!.id)) {
      const sx = x + NODE_W + 30;
      nodes.push(
        <g key={`spouse-${node.id}`}>
          <line x1={x + NODE_W / 2} y1={y + NODE_H / 2} x2={sx - NODE_W / 2} y2={y + NODE_H / 2} stroke="var(--color-accent)" strokeWidth="1.5" strokeDasharray="4 2" />
          <rect x={sx - NODE_W / 2} y={y} width={NODE_W} height={NODE_H} rx="8" fill="var(--color-surface)" stroke="var(--color-accent)" strokeWidth="1.5" style={{ cursor: 'pointer' }} onClick={() => setPopupId(node.spouse!.id)} />
          <circle cx={sx - NODE_W / 2 + 22} cy={y + 22} r="14" fill="var(--color-accent)" />
          <text x={sx - NODE_W / 2 + 22} y={y + 26} textAnchor="middle" fill="white" fontSize="10" fontWeight="bold">{node.spouse.first_name?.[0]}{node.spouse.last_name?.[0]}</text>
          <text x={sx - NODE_W / 2 + 44} y={y + 22} fill="var(--color-text)" fontSize="10" fontWeight="500">{node.spouse.first_name} {node.spouse.last_name}</text>
          <text x={sx - NODE_W / 2 + 44} y={y + 38} fill="var(--color-accent)" fontSize="8">Spouse</text>
        </g>
      );
    }

    return nodes;
  };

  const handleWheel = useCallback((e: React.WheelEvent) => {
    e.preventDefault(); setScale(s => Math.max(0.2, Math.min(3, s + (e.deltaY > 0 ? -0.1 : 0.1))));
  }, []);

  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    if (e.target === e.currentTarget || (e.target as HTMLElement).tagName === 'svg') {
      setDragging(true); setDragStart({ x: e.clientX - pos.x, y: e.clientY - pos.y });
    }
  }, [pos]);

  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    if (dragging) setPos({ x: e.clientX - dragStart.x, y: e.clientY - dragStart.y });
  }, [dragging, dragStart]);

  const allLines = tree.flatMap(t => renderLines(t, 0, 0));
  const allNodes = tree.flatMap((t, i) => renderNode(t, i * (NODE_W * 2 + SIBLING_GAP), 20));

  return (
    <div>
      <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '0.75rem' }}>
        <button onClick={() => setScale(s => Math.min(3, s + 0.2))} className="btn btn-outline btn-sm">🔍+</button>
        <button onClick={() => setScale(s => Math.max(0.2, s - 0.2))} className="btn btn-outline btn-sm">🔍-</button>
        <button onClick={() => { setScale(1); setPos({ x: 0, y: 0 }); }} className="btn btn-ghost btn-sm">↺ Reset</button>
        <span style={{ fontSize: 'var(--font-size-xs)', color: 'var(--color-text-muted)', padding: '0.375rem 0' }}>Click any member for details</span>
      </div>

      <div
        onWheel={handleWheel} onMouseDown={handleMouseDown} onMouseMove={handleMouseMove}
        onMouseUp={() => setDragging(false)} onMouseLeave={() => setDragging(false)}
        style={{ position: 'relative', overflow: 'hidden', height: 500, border: '2px dashed var(--color-border)', borderRadius: 'var(--radius)', cursor: dragging ? 'grabbing' : 'grab', background: 'var(--color-bg)' }}
      >
        <div style={{ transform: `translate(${pos.x}px, ${pos.y}px) scale(${scale})`, transformOrigin: '0 0' }}>
          <svg width={3000} height={3000} style={{ position: 'absolute', top: 0, left: 0 }}>{allLines}</svg>
          <svg width={3000} height={3000} style={{ position: 'absolute', top: 0, left: 0, pointerEvents: 'none' }}>{allNodes}</svg>
          {/* Clickable overlay for nodes */}
          <div style={{ position: 'absolute', top: 0, left: 0, width: 3000, height: 3000, pointerEvents: 'none' }}>
            {/* The actual clickable areas are in the SVG rect elements which handle clicks via onClick */}
          </div>
        </div>
      </div>

      {popupId && <MemberPopup memberId={popupId} onClose={() => setPopupId(null)} />}
    </div>
  );
}
