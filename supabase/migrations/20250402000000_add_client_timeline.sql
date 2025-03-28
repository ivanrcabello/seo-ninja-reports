
-- Create client_tasks table
CREATE TABLE public.client_tasks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  client_id UUID NOT NULL REFERENCES public.clients(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  status TEXT NOT NULL DEFAULT 'pending',
  priority TEXT NOT NULL DEFAULT 'medium',
  due_date TIMESTAMP WITH TIME ZONE,
  assigned_to TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL
);

-- Add RLS policies
ALTER TABLE public.client_tasks ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own client tasks"
  ON public.client_tasks
  FOR SELECT
  USING (
    client_id IN (SELECT id FROM public.clients WHERE user_id = auth.uid())
  );

CREATE POLICY "Users can insert their own client tasks"
  ON public.client_tasks
  FOR INSERT
  WITH CHECK (
    client_id IN (SELECT id FROM public.clients WHERE user_id = auth.uid())
  );

CREATE POLICY "Users can update their own client tasks"
  ON public.client_tasks
  FOR UPDATE
  USING (
    client_id IN (SELECT id FROM public.clients WHERE user_id = auth.uid())
  );

CREATE POLICY "Users can delete their own client tasks"
  ON public.client_tasks
  FOR DELETE
  USING (
    client_id IN (SELECT id FROM public.clients WHERE user_id = auth.uid())
  );

-- Create trigger to update updated_at on changes
CREATE TRIGGER update_client_tasks_updated_at
BEFORE UPDATE ON public.client_tasks
FOR EACH ROW EXECUTE FUNCTION update_proposal_updated_at();
