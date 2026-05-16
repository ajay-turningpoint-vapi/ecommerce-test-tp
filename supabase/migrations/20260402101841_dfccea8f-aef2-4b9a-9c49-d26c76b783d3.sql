
CREATE POLICY "No client access to admin_users" ON public.admin_users FOR SELECT USING (false);
