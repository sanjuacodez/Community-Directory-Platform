'use client';
import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/stores/auth';

interface UserRow { user_id: string; email: string | null; member_name: string | null; roles: string[]; }

export default function AdminRolesPage() {
  const { user, roles } = useAuth();
  const [users, setUsers] = useState<UserRow[]>([]);
  const [allRoles, setAllRoles] = useState<{ id: string; name: string }[]>([]);
  const [loading, setLoading] = useState(true);

  const load = async () => {
    setLoading(true);
    const { data: rolesList } = await supabase.from('roles').select('id,name');
    setAllRoles((rolesList as any) ?? []);

    // Get all member records that have user_id linked
    const { data: members } = await supabase.from('members').select('id,first_name,last_name,email,user_id').not('user_id', 'is', null);
    const { data: userRoles } = await supabase.from('user_roles').select('user_id, role:roles(name)');

    // Build user list
    const userMap = new Map<string, UserRow>();
    (members as any[])?.forEach((m: any) => {
      userMap.set(m.user_id, { user_id: m.user_id, email: m.email, member_name: `${m.first_name} ${m.last_name}`, roles: [] });
    });
    (userRoles as any[])?.forEach((ur: any) => {
      const u = userMap.get(ur.user_id);
      if (u) u.roles.push(ur.role?.name ?? '');
      else userMap.set(ur.user_id, { user_id: ur.user_id, email: null, member_name: null, roles: [ur.role?.name ?? ''] });
    });

    setUsers(Array.from(userMap.values()));
    setLoading(false);
  };

  useEffect(() => { load(); }, []);

  const toggleRole = async (userId: string, roleName: string, hasRole: boolean) => {
    const { data: roleData } = await supabase.from('roles').select('id').eq('name', roleName).single();
    if (!roleData) return;

    if (hasRole) {
      await supabase.from('user_roles').delete().eq('user_id', userId).eq('role_id', roleData.id);
    } else {
      await supabase.from('user_roles').insert({ user_id: userId, role_id: roleData.id });
    }
    load();
  };

  if (!user || !roles.includes('super_admin')) return <div className="p-6 text-center"><p className="text-zinc-500">Super admin access required.</p></div>;

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">User Role Management</h1>

      {loading && <p className="text-zinc-500">Loading...</p>}

      <div className="space-y-3">
        {users.map(u => (
          <div key={u.user_id} className="rounded-xl border border-zinc-200 bg-white p-5">
            <div className="flex items-start justify-between">
              <div>
                <p className="font-medium">{u.member_name || 'Unknown User'}</p>
                <p className="text-sm text-zinc-500">{u.email || u.user_id}</p>
              </div>
              <div className="flex flex-wrap gap-1">
                {allRoles.map(r => {
                  const hasRole = u.roles.includes(r.name);
                  return (
                    <button
                      key={r.id}
                      onClick={() => toggleRole(u.user_id, r.name, hasRole)}
                      className={`px-2 py-1 rounded text-xs font-medium transition-colors ${
                        hasRole
                          ? 'bg-zinc-900 text-white hover:bg-red-600'
                          : 'bg-zinc-100 text-zinc-500 hover:bg-zinc-200'
                      }`}
                      title={hasRole ? `Click to remove ${r.name}` : `Click to assign ${r.name}`}
                    >
                      {r.name.replace('_', ' ')}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        ))}
        {!loading && users.length === 0 && (
          <div className="rounded-xl border border-zinc-200 bg-white p-12 text-center">
            <p className="text-zinc-500">No users with roles found.</p>
            <p className="text-sm text-zinc-400 mt-1">Register a user at /login first, then link them to a member record.</p>
          </div>
        )}
      </div>
    </div>
  );
}
