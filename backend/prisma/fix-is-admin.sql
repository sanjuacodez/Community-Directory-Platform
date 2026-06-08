-- FIX: Run this in Supabase SQL Editor to fix the is_admin() error
-- All tables/roles/policies already exist. This just adds the missing function + admin policies.

-- Create the function first (this was missing)
CREATE OR REPLACE FUNCTION is_admin()
RETURNS boolean AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM user_roles ur
    JOIN roles r ON r.id = ur.role_id
    WHERE ur.user_id = auth.uid() AND r.name = 'super_admin'
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Now add admin policies (they need the function above)
CREATE POLICY "Admin all communities" ON communities FOR ALL USING (is_admin()) WITH CHECK (is_admin());
CREATE POLICY "Admin all families" ON families FOR ALL USING (is_admin()) WITH CHECK (is_admin());
CREATE POLICY "Admin all members" ON members FOR ALL USING (is_admin()) WITH CHECK (is_admin());
CREATE POLICY "Admin all relationships" ON member_relationships FOR ALL USING (is_admin()) WITH CHECK (is_admin());
CREATE POLICY "Admin all announcements" ON announcements FOR ALL USING (is_admin()) WITH CHECK (is_admin());
CREATE POLICY "Admin all events" ON events FOR ALL USING (is_admin()) WITH CHECK (is_admin());
CREATE POLICY "Admin all businesses" ON businesses FOR ALL USING (is_admin()) WITH CHECK (is_admin());
CREATE POLICY "Admin all jobs" ON jobs FOR ALL USING (is_admin()) WITH CHECK (is_admin());
CREATE POLICY "Admin all obituaries" ON obituaries FOR ALL USING (is_admin()) WITH CHECK (is_admin());
CREATE POLICY "Admin user_roles" ON user_roles FOR ALL USING (is_admin()) WITH CHECK (is_admin());
CREATE POLICY "Admin audit_logs" ON audit_logs FOR SELECT USING (is_admin());
