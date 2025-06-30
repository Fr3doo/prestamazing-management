
// Logique métier centralisée et utilisée
export const BusinessLogic = {
  // Logique pour les avis
  reviews: {
    calculateAverageRating: (reviews: Array<{ rating: number }>) => {
      if (reviews.length === 0) return 0;
      const total = reviews.reduce((sum, review) => sum + review.rating, 0);
      return Math.round((total / reviews.length) * 10) / 10;
    },
    
    getRatingDistribution: (reviews: Array<{ rating: number }>) => {
      const distribution = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
      reviews.forEach(review => {
        distribution[review.rating as keyof typeof distribution]++;
      });
      return distribution;
    },
  },
  
  // Logique pour le contenu
  content: {
    generateSlug: (title: string) => {
      return title
        .toLowerCase()
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .replace(/[^a-z0-9\s-]/g, '')
        .replace(/\s+/g, '-')
        .replace(/-+/g, '-')
        .trim();
    },
    
    truncateText: (text: string, maxLength: number) => {
      if (text.length <= maxLength) return text;
      return text.substring(0, maxLength).replace(/\s+\S*$/, '') + '...';
    },
  },
};
