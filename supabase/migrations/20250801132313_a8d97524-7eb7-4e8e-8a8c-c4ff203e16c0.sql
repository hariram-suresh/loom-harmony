-- Create enum types for roles and categories
CREATE TYPE public.user_role AS ENUM ('handloom_head', 'district_head', 'department_employee', 'society_admin', 'weaver', 'buyer');
CREATE TYPE public.saree_variety AS ENUM ('silk', 'cotton', 'handloom', 'banarasi', 'kanjivaram', 'other');
CREATE TYPE public.saree_material AS ENUM ('pure_silk', 'cotton', 'silk_cotton', 'synthetic', 'linen', 'other');
CREATE TYPE public.order_status AS ENUM ('pending', 'confirmed', 'in_progress', 'completed', 'shipped', 'delivered', 'cancelled');
CREATE TYPE public.scheme_status AS ENUM ('draft', 'submitted', 'under_review', 'approved', 'rejected');

-- Create profiles table for user information
CREATE TABLE public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL,
  full_name TEXT NOT NULL,
  phone TEXT,
  role user_role NOT NULL,
  state TEXT,
  district TEXT,
  society_name TEXT,
  parent_id UUID REFERENCES public.profiles(id),
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Create sarees table
CREATE TABLE public.sarees (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  weaver_id UUID NOT NULL REFERENCES public.profiles(id),
  title TEXT NOT NULL,
  description TEXT,
  variety saree_variety NOT NULL,
  material saree_material NOT NULL,
  color TEXT NOT NULL,
  design TEXT NOT NULL,
  price DECIMAL(10,2) NOT NULL,
  cost_price DECIMAL(10,2),
  is_available BOOLEAN DEFAULT true,
  images TEXT[],
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Create orders table
CREATE TABLE public.orders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  buyer_id UUID NOT NULL REFERENCES public.profiles(id),
  saree_id UUID NOT NULL REFERENCES public.sarees(id),
  quantity INTEGER DEFAULT 1,
  total_amount DECIMAL(10,2) NOT NULL,
  status order_status DEFAULT 'pending',
  stripe_session_id TEXT,
  shipping_address JSONB,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Create progress_updates table for tracking saree production
CREATE TABLE public.progress_updates (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id UUID NOT NULL REFERENCES public.orders(id),
  weaver_id UUID NOT NULL REFERENCES public.profiles(id),
  status TEXT NOT NULL,
  message TEXT,
  images TEXT[],
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Create government_schemes table
CREATE TABLE public.government_schemes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  eligibility_criteria TEXT NOT NULL,
  benefits TEXT NOT NULL,
  application_deadline DATE,
  state TEXT,
  district TEXT,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Create scheme_applications table
CREATE TABLE public.scheme_applications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  weaver_id UUID NOT NULL REFERENCES public.profiles(id),
  scheme_id UUID NOT NULL REFERENCES public.government_schemes(id),
  status scheme_status DEFAULT 'draft',
  application_data JSONB,
  reviewed_by UUID REFERENCES public.profiles(id),
  review_notes TEXT,
  submitted_at TIMESTAMPTZ,
  reviewed_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Create messages table for communication
CREATE TABLE public.messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  sender_id UUID NOT NULL REFERENCES public.profiles(id),
  recipient_id UUID NOT NULL REFERENCES public.profiles(id),
  subject TEXT,
  content TEXT NOT NULL,
  is_read BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Create weaver_metrics table for earnings and production tracking
CREATE TABLE public.weaver_metrics (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  weaver_id UUID NOT NULL REFERENCES public.profiles(id),
  month INTEGER NOT NULL,
  year INTEGER NOT NULL,
  total_earnings DECIMAL(10,2) DEFAULT 0,
  sarees_completed INTEGER DEFAULT 0,
  orders_fulfilled INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(weaver_id, month, year)
);

-- Enable Row Level Security
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.sarees ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.progress_updates ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.government_schemes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.scheme_applications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.weaver_metrics ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for profiles
CREATE POLICY "Users can view their own profile" ON public.profiles
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update their own profile" ON public.profiles
  FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Society members can view hierarchy" ON public.profiles
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.profiles p 
      WHERE p.id = auth.uid() 
      AND p.role IN ('handloom_head', 'district_head', 'department_employee', 'society_admin')
    )
  );

-- Create RLS policies for sarees
CREATE POLICY "Anyone can view available sarees" ON public.sarees
  FOR SELECT USING (is_available = true);

CREATE POLICY "Weavers can manage their sarees" ON public.sarees
  FOR ALL USING (weaver_id = auth.uid());

-- Create RLS policies for orders
CREATE POLICY "Buyers can view their orders" ON public.orders
  FOR SELECT USING (buyer_id = auth.uid());

CREATE POLICY "Weavers can view orders for their sarees" ON public.orders
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.sarees s 
      WHERE s.id = saree_id AND s.weaver_id = auth.uid()
    )
  );

CREATE POLICY "Buyers can create orders" ON public.orders
  FOR INSERT WITH CHECK (buyer_id = auth.uid());

-- Create RLS policies for progress updates
CREATE POLICY "Weavers can create progress updates" ON public.progress_updates
  FOR INSERT WITH CHECK (weaver_id = auth.uid());

CREATE POLICY "Order stakeholders can view progress" ON public.progress_updates
  FOR SELECT USING (
    weaver_id = auth.uid() OR 
    EXISTS (SELECT 1 FROM public.orders o WHERE o.id = order_id AND o.buyer_id = auth.uid())
  );

-- Create RLS policies for government schemes
CREATE POLICY "Anyone can view active schemes" ON public.government_schemes
  FOR SELECT USING (is_active = true);

-- Create RLS policies for scheme applications
CREATE POLICY "Weavers can manage their applications" ON public.scheme_applications
  FOR ALL USING (weaver_id = auth.uid());

CREATE POLICY "District heads can review applications" ON public.scheme_applications
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM public.profiles p 
      WHERE p.id = auth.uid() 
      AND p.role IN ('district_head', 'handloom_head')
    )
  );

-- Create RLS policies for messages
CREATE POLICY "Users can view their messages" ON public.messages
  FOR SELECT USING (sender_id = auth.uid() OR recipient_id = auth.uid());

CREATE POLICY "Users can send messages" ON public.messages
  FOR INSERT WITH CHECK (sender_id = auth.uid());

-- Create RLS policies for weaver metrics
CREATE POLICY "Weavers can view their metrics" ON public.weaver_metrics
  FOR SELECT USING (weaver_id = auth.uid());

CREATE POLICY "System can update metrics" ON public.weaver_metrics
  FOR ALL USING (true);

-- Create function to handle new user registration
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = ''
AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name, role)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'full_name', 'User'),
    COALESCE((NEW.raw_user_meta_data->>'role')::user_role, 'buyer')
  );
  RETURN NEW;
END;
$$;

-- Create trigger for new user registration
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Create function to update metrics when order is completed
CREATE OR REPLACE FUNCTION public.update_weaver_metrics()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = ''
AS $$
DECLARE
  weaver_id_var UUID;
  current_month INT;
  current_year INT;
BEGIN
  -- Get weaver ID from saree
  SELECT s.weaver_id INTO weaver_id_var
  FROM public.sarees s
  WHERE s.id = NEW.saree_id;
  
  -- Get current month and year
  current_month := EXTRACT(MONTH FROM NEW.updated_at);
  current_year := EXTRACT(YEAR FROM NEW.updated_at);
  
  -- Update or insert metrics
  INSERT INTO public.weaver_metrics (weaver_id, month, year, total_earnings, orders_fulfilled)
  VALUES (weaver_id_var, current_month, current_year, NEW.total_amount, 1)
  ON CONFLICT (weaver_id, month, year)
  DO UPDATE SET
    total_earnings = weaver_metrics.total_earnings + NEW.total_amount,
    orders_fulfilled = weaver_metrics.orders_fulfilled + 1;
    
  RETURN NEW;
END;
$$;

-- Create trigger for updating weaver metrics
CREATE TRIGGER update_metrics_on_order_completion
  AFTER UPDATE OF status ON public.orders
  FOR EACH ROW
  WHEN (NEW.status = 'delivered' AND OLD.status != 'delivered')
  EXECUTE FUNCTION public.update_weaver_metrics();