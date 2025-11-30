-- 初始数据库架构
-- 创建用户配置文件表
CREATE TABLE public.profiles (
  id uuid NOT NULL,
  updated_at timestamp with time zone NULL,
  username text NULL,
  full_name text NULL,
  avatar_url text NULL,
  website text NULL,
  bio text NULL,
  role text NULL DEFAULT 'user'::text,
  CONSTRAINT profiles_pkey PRIMARY KEY (id),
  CONSTRAINT profiles_username_key UNIQUE (username),
  CONSTRAINT username_length CHECK ((char_length(username) >= 3)),
  CONSTRAINT profiles_id_fkey FOREIGN KEY (id) REFERENCES auth.users(id) ON DELETE CASCADE
);

-- 创建分类表
CREATE TABLE public.categories (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  created_at timestamp with time zone NULL DEFAULT now(),
  name text NOT NULL,
  description text NULL,
  color text NULL DEFAULT '#3B82F6'::text,
  icon text NULL,
  user_id uuid NULL,
  CONSTRAINT categories_pkey PRIMARY KEY (id),
  CONSTRAINT categories_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.profiles(id) ON DELETE CASCADE
);

-- 创建项目表
CREATE TABLE public.projects (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  created_at timestamp with time zone NULL DEFAULT now(),
  updated_at timestamp with time zone NULL DEFAULT now(),
  name text NOT NULL,
  description text NULL,
  status text NULL DEFAULT 'active'::text,
  priority text NULL DEFAULT 'medium'::text,
  due_date timestamp with time zone NULL,
  user_id uuid NULL,
  category_id uuid NULL,
  CONSTRAINT projects_pkey PRIMARY KEY (id),
  CONSTRAINT projects_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.profiles(id) ON DELETE CASCADE,
  CONSTRAINT projects_category_id_fkey FOREIGN KEY (category_id) REFERENCES public.categories(id) ON DELETE SET NULL
);

-- 创建任务表
CREATE TABLE public.tasks (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  created_at timestamp with time zone NULL DEFAULT now(),
  updated_at timestamp with time zone NULL DEFAULT now(),
  title text NOT NULL,
  description text NULL,
  status text NULL DEFAULT 'todo'::text,
  priority text NULL DEFAULT 'medium'::text,
  due_date timestamp with time zone NULL,
  project_id uuid NULL,
  user_id uuid NULL,
  CONSTRAINT tasks_pkey PRIMARY KEY (id),
  CONSTRAINT tasks_project_id_fkey FOREIGN KEY (project_id) REFERENCES public.projects(id) ON DELETE CASCADE,
  CONSTRAINT tasks_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.profiles(id) ON DELETE CASCADE
);

-- 创建文件表
CREATE TABLE public.files (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  created_at timestamp with time zone NULL DEFAULT now(),
  name text NOT NULL,
  size bigint NULL,
  type text NULL,
  path text NOT NULL,
  bucket text NOT NULL DEFAULT 'uploads'::text,
  user_id uuid NULL,
  project_id uuid NULL,
  CONSTRAINT files_pkey PRIMARY KEY (id),
  CONSTRAINT files_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.profiles(id) ON DELETE CASCADE,
  CONSTRAINT files_project_id_fkey FOREIGN KEY (project_id) REFERENCES public.projects(id) ON DELETE CASCADE
);

-- 创建通知表
CREATE TABLE public.notifications (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  created_at timestamp with time zone NULL DEFAULT now(),
  read_at timestamp with time zone NULL,
  title text NOT NULL,
  message text NULL,
  type text NULL DEFAULT 'info'::text,
  user_id uuid NULL,
  data jsonb NULL,
  CONSTRAINT notifications_pkey PRIMARY KEY (id),
  CONSTRAINT notifications_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.profiles(id) ON DELETE CASCADE
);

-- 创建用户设置表
CREATE TABLE public.user_settings (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  created_at timestamp with time zone NULL DEFAULT now(),
  updated_at timestamp with time zone NULL DEFAULT now(),
  user_id uuid NOT NULL,
  theme text NULL DEFAULT 'light'::text,
  language text NULL DEFAULT 'zh-CN'::text,
  email_notifications boolean NULL DEFAULT true,
  push_notifications boolean NULL DEFAULT true,
  settings jsonb NULL,
  CONSTRAINT user_settings_pkey PRIMARY KEY (id),
  CONSTRAINT user_settings_user_id_key UNIQUE (user_id),
  CONSTRAINT user_settings_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.profiles(id) ON DELETE CASCADE
);

-- 创建审计日志表
CREATE TABLE public.audit_logs (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  created_at timestamp with time zone NULL DEFAULT now(),
  user_id uuid NULL,
  action text NOT NULL,
  table_name text NULL,
  record_id uuid NULL,
  old_values jsonb NULL,
  new_values jsonb NULL,
  ip_address inet NULL,
  user_agent text NULL,
  CONSTRAINT audit_logs_pkey PRIMARY KEY (id),
  CONSTRAINT audit_logs_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.profiles(id) ON DELETE SET NULL
);

-- 创建索引
CREATE INDEX profiles_id_idx ON public.profiles USING btree (id);
CREATE INDEX profiles_username_idx ON public.profiles USING btree (username);
CREATE INDEX categories_user_id_idx ON public.categories USING btree (user_id);
CREATE INDEX projects_user_id_idx ON public.projects USING btree (user_id);
CREATE INDEX projects_category_id_idx ON public.projects USING btree (category_id);
CREATE INDEX projects_status_idx ON public.projects USING btree (status);
CREATE INDEX tasks_user_id_idx ON public.tasks USING btree (user_id);
CREATE INDEX tasks_project_id_idx ON public.tasks USING btree (project_id);
CREATE INDEX tasks_status_idx ON public.tasks USING btree (status);
CREATE INDEX files_user_id_idx ON public.files USING btree (user_id);
CREATE INDEX files_project_id_idx ON public.files USING btree (project_id);
CREATE INDEX notifications_user_id_idx ON public.notifications USING btree (user_id);
CREATE INDEX notifications_read_at_idx ON public.notifications USING btree (read_at);
CREATE INDEX audit_logs_user_id_idx ON public.audit_logs USING btree (user_id);
CREATE INDEX audit_logs_created_at_idx ON public.audit_logs USING btree (created_at);

-- 创建 RLS (Row Level Security) 策略
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.tasks ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.files ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.audit_logs ENABLE ROW LEVEL SECURITY;

-- 用户配置文件 RLS 策略
CREATE POLICY "Users can view own profile." ON public.profiles FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users can update own profile." ON public.profiles FOR UPDATE USING (auth.uid() = id);
CREATE POLICY "Users can insert own profile." ON public.profiles FOR INSERT WITH CHECK (auth.uid() = id);

-- 分类 RLS 策略
CREATE POLICY "Users can view own categories." ON public.categories FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can create own categories." ON public.categories FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own categories." ON public.categories FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own categories." ON public.categories FOR DELETE USING (auth.uid() = user_id);

-- 项目 RLS 策略
CREATE POLICY "Users can view own projects." ON public.projects FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can create own projects." ON public.projects FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own projects." ON public.projects FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own projects." ON public.projects FOR DELETE USING (auth.uid() = user_id);

-- 任务 RLS 策略
CREATE POLICY "Users can view own tasks." ON public.tasks FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can create own tasks." ON public.tasks FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own tasks." ON public.tasks FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own tasks." ON public.tasks FOR DELETE USING (auth.uid() = user_id);

-- 文件 RLS 策略
CREATE POLICY "Users can view own files." ON public.files FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can create own files." ON public.files FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own files." ON public.files FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own files." ON public.files FOR DELETE USING (auth.uid() = user_id);

-- 通知 RLS 策略
CREATE POLICY "Users can view own notifications." ON public.notifications FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can create own notifications." ON public.notifications FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own notifications." ON public.notifications FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own notifications." ON public.notifications FOR DELETE USING (auth.uid() = user_id);

-- 用户设置 RLS 策略
CREATE POLICY "Users can view own settings." ON public.user_settings FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can create own settings." ON public.user_settings FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own settings." ON public.user_settings FOR UPDATE USING (auth.uid() = user_id);

-- 审计日志 RLS 策略
CREATE POLICY "Users can view own audit logs." ON public.audit_logs FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can create own audit logs." ON public.audit_logs FOR INSERT WITH CHECK (auth.uid() = user_id);

-- 创建触发器函数，用于自动更新 updated_at 字段
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- 为需要的表创建触发器
CREATE TRIGGER handle_profiles_updated_at BEFORE UPDATE ON public.profiles FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();
CREATE TRIGGER handle_projects_updated_at BEFORE UPDATE ON public.projects FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();
CREATE TRIGGER handle_tasks_updated_at BEFORE UPDATE ON public.tasks FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();
CREATE TRIGGER handle_user_settings_updated_at BEFORE UPDATE ON public.user_settings FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

-- 创建触发器函数，用于自动创建用户配置文件
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, full_name, avatar_url)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.raw_user_meta_data->>'name'),
    NEW.raw_user_meta_data->>'avatar_url'
  );
  
  -- 为新用户创建默认设置
  INSERT INTO public.user_settings (user_id)
  VALUES (NEW.id);
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 在 auth.users 表上创建触发器
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- 创建触发器函数，用于记录审计日志
CREATE OR REPLACE FUNCTION public.audit_trigger()
RETURNS TRIGGER AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    INSERT INTO public.audit_logs (user_id, action, table_name, record_id, new_values)
    VALUES (
      COALESCE(auth.uid(), NULL),
      'INSERT',
      TG_TABLE_NAME,
      NEW.id,
      to_jsonb(NEW)
    );
    RETURN NEW;
  ELSIF TG_OP = 'UPDATE' THEN
    INSERT INTO public.audit_logs (user_id, action, table_name, record_id, old_values, new_values)
    VALUES (
      COALESCE(auth.uid(), NULL),
      'UPDATE',
      TG_TABLE_NAME,
      COALESCE(NEW.id, OLD.id),
      to_jsonb(OLD),
      to_jsonb(NEW)
    );
    RETURN NEW;
  ELSIF TG_OP = 'DELETE' THEN
    INSERT INTO public.audit_logs (user_id, action, table_name, record_id, old_values)
    VALUES (
      COALESCE(auth.uid(), NULL),
      'DELETE',
      TG_TABLE_NAME,
      OLD.id,
      to_jsonb(OLD)
    );
    RETURN OLD;
  END IF;
  RETURN NULL;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 为重要表创建审计触发器
CREATE TRIGGER audit_categories_trigger
  AFTER INSERT OR UPDATE OR DELETE ON public.categories
  FOR EACH ROW EXECUTE FUNCTION public.audit_trigger();

CREATE TRIGGER audit_projects_trigger
  AFTER INSERT OR UPDATE OR DELETE ON public.projects
  FOR EACH ROW EXECUTE FUNCTION public.audit_trigger();

CREATE TRIGGER audit_tasks_trigger
  AFTER INSERT OR UPDATE OR DELETE ON public.tasks
  FOR EACH ROW EXECUTE FUNCTION public.audit_trigger();

-- 创建存储过程：获取用户统计信息
CREATE OR REPLACE FUNCTION public.get_user_stats(user_uuid uuid)
RETURNS json AS $$
DECLARE
  result json;
BEGIN
  SELECT json_build_object(
    'projects_count', (SELECT COUNT(*) FROM public.projects WHERE user_id = user_uuid),
    'tasks_count', (SELECT COUNT(*) FROM public.tasks WHERE user_id = user_uuid),
    'completed_tasks_count', (SELECT COUNT(*) FROM public.tasks WHERE user_id = user_uuid AND status = 'completed'),
    'categories_count', (SELECT COUNT(*) FROM public.categories WHERE user_id = user_uuid),
    'files_count', (SELECT COUNT(*) FROM public.files WHERE user_id = user_uuid),
    'unread_notifications_count', (SELECT COUNT(*) FROM public.notifications WHERE user_id = user_uuid AND read_at IS NULL)
  ) INTO result;
  
  RETURN result;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 创建存储过程：标记所有通知为已读
CREATE OR REPLACE FUNCTION public.mark_all_notifications_read(user_uuid uuid)
RETURNS void AS $$
BEGIN
  UPDATE public.notifications 
  SET read_at = now() 
  WHERE user_id = user_uuid AND read_at IS NULL;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 创建存储过程：获取用户最近活动
CREATE OR REPLACE FUNCTION public.get_recent_activities(user_uuid uuid, limit_count int DEFAULT 10)
RETURNS TABLE(id uuid, created_at timestamp with time zone, action text, table_name text, details jsonb) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    al.id,
    al.created_at,
    al.action,
    al.table_name,
    CASE 
      WHEN al.table_name = 'projects' THEN jsonb_build_object('name', (SELECT name FROM public.projects WHERE id = al.record_id))
      WHEN al.table_name = 'tasks' THEN jsonb_build_object('title', (SELECT title FROM public.tasks WHERE id = al.record_id))
      WHEN al.table_name = 'categories' THEN jsonb_build_object('name', (SELECT name FROM public.categories WHERE id = al.record_id))
      ELSE al.new_values
    END as details
  FROM public.audit_logs al
  WHERE al.user_id = user_uuid
  ORDER BY al.created_at DESC
  LIMIT limit_count;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;