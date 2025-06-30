
import { supabase } from '@/integrations/supabase/client';

export const exportAnalyticsData = async () => {
  try {
    const { data: allData } = await supabase.from('reviews').select('*');
    
    const csvContent = "data:text/csv;charset=utf-8," 
      + "Nom,Note,Commentaire,Date\n"
      + (allData || []).map(row => 
          `"${row.user_name}","${row.rating}","${row.comment.replace(/"/g, '""')}","${row.created_at}"`
        ).join("\n");

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `analytics-${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  } catch (error) {
    console.error('Erreur lors de l\'export:', error);
  }
};
