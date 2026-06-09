'use client';

import { useRef, useState, useCallback, useEffect } from 'react';
import Link from 'next/link';

interface Member {
  id: string; first_name: string; last_name: string; gender: string;
  blood_group?: string; profession?: string; location?: string;
  father_id?: string; mother_id?: string; spouse_ids?: string[]; children_ids?: string[];
}

interface TreeNode {
  member: Member;
  x: number; y: number;
  children: TreeNode[];
  spouse?: TreeNode;
}

interface Props {
  members: Member[];
  relationships: { member_id: string; related_member_id: string; relationship_type: string }[];
}

export function FamilyTree({ members, relationships }: Props) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(1);
  const [pos, setPos] = useState({ x: 0, y: 0 });
  const [dragging, setDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [selected, setSelected] = useState<string | null>(null);

  // Build the tree structure
  const buildTree = useCallback((): TreeNode[] => {
    const memberMap = new Map(members.map(m => [m.id, m]));
    const relMap = new Map<string, { father?: string; mother?: string; spouse?: string; children: string[] }>();

    members.forEach(m => { relMap.set(m.id, { children: [] }); });
    relationships.forEach(r => {
      const rel = relMap.get(r.member_id);
      if (!rel) return;
      if (r.relationship_type === 'father') rel.father = r.related_member_id;
      if (r.relationship_type === 'mother') rel.mother = r.related_member_id;
      if (r.relationship_type === 'spouse') rel.spouse = r.related_member_id;
      if (r.relationship_type === 'child') rel.children.push(r.related_member_id);
    });

    // Find root: members who are fathers/mothers but not children of anyone
    const childIds = new Set(relationships.filter(r => r.relationship_type === 'child').map(r => r.related_member_id));
    const fatherIds = new Set(relationships.filter(r => r.relationship_type === 'father').map(r => r.related_member_id));
    const motherIds = new Set(relationships.filter(r => r.relationship_type === 'mother').map(r => r.related_member_id));

    // Roots are those with relationships but not children of anyone in this set
    const roots = members.filter(m => {
      const hasRel = relationships.some(r => r.member_id === m.id || r.related_member_id === m.id);
      const isChild = childIds.has(m.id);
      return hasRel && !isChild;
    });

    if (roots.length === 0) return [];

    const buildNode = (memberId: string, level: number, siblingIndex: number): TreeNode | null => {
      const member = memberMap.get(memberId);
      if (!member) return null;
      const rel = relMap.get(memberId);
      const children = (rel?.children || []).map((cid, i) => buildNode(cid, level + 1, i)).filter(Boolean) as TreeNode[];

      const spouseId = rel?.spouse;
      const spouse = spouseId ? memberMap.get(spouseId) : undefined;

      return {
        member,
        x: siblingIndex * 200,
        y: level * 120,
        children,
        spouse: spouse && !children.some(c => c.member.id === spouse.id) ? { member: spouse, x: siblingIndex * 200 + 160, y: level * 120, children: [] } : undefined,
      };
    };

    return roots.map((r, i) => buildNode(r.id, 0, i)).filter(Boolean) as TreeNode[];
  }, [members, relationships]);

  const tree = buildTree();

  // Pan and zoom handlers
  const handleWheel = useCallback((e: React.WheelEvent) => {
    e.preventDefault();
    const delta = e.deltaY > 0 ? -0.1 : 0.1;
    setScale(s => Math.max(0.2, Math.min(3, s + delta)));
  }, []);

  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    if (e.target === containerRef.current || (e.target as HTMLElement).dataset.panArea) {
      setDragging(true);
      setDragStart({ x: e.clientX - pos.x, y: e.clientY - pos.y });
    }
  }, [pos]);

  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    if (dragging) setPos({ x: e.clientX - dragStart.x, y: e.clientY - dragStart.y });
  }, [dragging, dragStart]);

  const handleMouseUp = useCallback(() => { setDragging(false); }, []);

  if (tree.length === 0) {
    return <div className="card" style={{ padding: '3rem', textAlign: 'center' }}><p style={{ color: 'var(--color-text-muted)' }}>No family relationships to display. Add relationships from member profiles to build the tree.</p></div>;
  }

  const renderNode = (node: TreeNode) => {
    const m = node.member;
    return (
      <div key={m.id} style={{ position: 'absolute', left: node.x, top: node.y }}>
        {/* Lines to children */}
        {node.children.map((child, i) => {
          const childX = child.x + 80;
          const childY = child.y;
          const parentX = node.x + 80;
          const parentY = node.y + 70;
          return (
            <svg key={`line-${i}`} style={{ position: 'absolute', left: 0, top: 0, width: Math.abs(childX - parentX) + 200, height: Math.abs(childY - parentY) + 10, pointerEvents: 'none', overflow: 'visible' }}>
              <path d={`M 80 70 L 80 ${(childY - parentY) / 2 + 70} L ${childX - node.x} ${(childY - parentY) / 2 + 70} L ${childX - node.x} ${childY - node.y}`} stroke="var(--color-border)" strokeWidth="1.5" fill="none" />
            </svg>
          );
        })}

        {/* Node card */}
        <Link
          href={`/members/${m.id}`}
          onClick={(e) => { setSelected(m.id); e.preventDefault(); }}
          style={{
            display: 'flex', alignItems: 'center', gap: '0.5rem',
            padding: '0.5rem 0.75rem',
            background: selected === m.id ? 'var(--color-primary)' : 'var(--color-surface)',
            color: selected === m.id ? 'white' : 'var(--color-text)',
            border: '2px solid ' + (selected === m.id ? 'var(--color-primary)' : 'var(--color-border)'),
            borderRadius: 'var(--radius)',
            cursor: 'pointer', textDecoration: 'none',
            whiteSpace: 'nowrap', fontSize: 'var(--font-size-xs)',
            boxShadow: selected === m.id ? '0 4px 12px rgba(0,0,0,0.15)' : 'none',
            zIndex: selected === m.id ? 10 : 1,
          }}
          title={`${m.first_name} ${m.last_name}${m.profession ? ' · ' + m.profession : ''}${m.location ? ' · ' + m.location : ''}`}
        >
          <div className="avatar" style={{ width: 32, height: 32, fontSize: '0.75rem' }}>{m.first_name?.[0]}{m.last_name?.[0]}</div>
          <div>
            <div style={{ fontWeight: 600 }}>{m.first_name} {m.last_name}</div>
            {m.blood_group && <div style={{ fontSize: '0.65rem', opacity: 0.7 }}>{m.blood_group}</div>}
          </div>
        </Link>

        {/* Spouse */}
        {node.spouse && (
          <div style={{ position: 'absolute', left: 160, top: 0 }}>
            <svg style={{ position: 'absolute', left: -80, top: 35, pointerEvents: 'none', overflow: 'visible' }}>
              <line x1={0} y1={0} x2={80} y2={0} stroke="var(--color-accent)" strokeWidth="1.5" strokeDasharray="4 2" />
            </svg>
            <Link
              href={`/members/${node.spouse.member.id}`}
              style={{
                display: 'flex', alignItems: 'center', gap: '0.25rem',
                padding: '0.35rem 0.5rem',
                background: 'var(--color-surface)',
                border: '1.5px solid var(--color-accent)',
                borderRadius: 'var(--radius-sm)',
                cursor: 'pointer', textDecoration: 'none',
                fontSize: '0.7rem',
              }}
            >
              <span className="avatar" style={{ width: 24, height: 24, fontSize: '0.6rem' }}>{node.spouse.member.first_name?.[0]}{node.spouse.member.last_name?.[0]}</span>
              {node.spouse.member.first_name}
            </Link>
          </div>
        )}

        {/* Recursively render children */}
        {node.children.map(renderNode)}
      </div>
    );
  };

  // Calculate bounds
  const allNodes = (roots: TreeNode[]): TreeNode[] => roots.flatMap(r => [r, r.spouse, ...allNodes(r.children)].filter(Boolean)) as TreeNode[];
  const nodes = allNodes(tree);
  const maxX = Math.max(...nodes.map(n => n.x + 200), 400);
  const maxY = Math.max(...nodes.map(n => n.y + 150), 300);
  const minX = Math.min(...nodes.map(n => n.x), 0) - 50;

  return (
    <div style={{ position: 'relative' }}>
      <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '0.75rem' }}>
        <button onClick={() => setScale(s => Math.min(3, s + 0.2))} className="btn btn-outline btn-sm" title="Zoom in">🔍+</button>
        <button onClick={() => setScale(s => Math.max(0.2, s - 0.2))} className="btn btn-outline btn-sm" title="Zoom out">🔍-</button>
        <button onClick={() => { setScale(1); setPos({ x: 0, y: 0 }); }} className="btn btn-ghost btn-sm" title="Reset view">↺ Reset</button>
        {selected && (
          <Link href={`/members/${selected}`} className="btn btn-primary btn-sm">View Full Profile →</Link>
        )}
      </div>

      <div
        ref={containerRef}
        data-pan-area="true"
        onWheel={handleWheel}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
        style={{
          position: 'relative', overflow: 'hidden',
          height: 500,
          border: '2px dashed var(--color-border)',
          borderRadius: 'var(--radius)',
          cursor: dragging ? 'grabbing' : 'grab',
          background: 'var(--color-bg)',
        }}
      >
        <div style={{
          transform: `translate(${pos.x}px, ${pos.y}px) scale(${scale})`,
          transformOrigin: '0 0',
          position: 'absolute',
          width: maxX - minX + 100,
          height: maxY + 50,
          left: Math.abs(minX) + 20,
          top: 20,
        }}>
          {tree.map(renderNode)}
        </div>
      </div>
    </div>
  );
}
