
-- Vérifier si le rôle admin existe pour cet utilisateur
SELECT 'Current user roles' as info, user_id, role 
FROM public.user_roles 
WHERE user_id = '733b1bfe-13e4-4ad0-9b4f-686e2264c528';

-- Ajouter le rôle admin si il n'existe pas
INSERT INTO public.user_roles (user_id, role) 
VALUES ('733b1bfe-13e4-4ad0-9b4f-686e2264c528', 'admin')
ON CONFLICT (user_id, role) DO NOTHING;

-- Vérifier que la fonction is_admin fonctionne maintenant
SELECT 'is_admin function test' as info, 
       public.is_admin('733b1bfe-13e4-4ad0-9b4f-686e2264c528') as is_admin_result;

-- Afficher le résultat final
SELECT 'Final verification' as info, user_id, role 
FROM public.user_roles 
WHERE user_id = '733b1bfe-13e4-4ad0-9b4f-686e2264c528';
