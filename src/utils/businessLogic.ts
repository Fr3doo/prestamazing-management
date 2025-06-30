
// Centralized business logic utilities
export const BusinessLogic = {
  // Review-related business logic
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
    
    filterByRating: (reviews: Array<{ rating: number }>, minRating: number) => {
      return reviews.filter(review => review.rating >= minRating);
    }
  },
  
  // Content-related business logic
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
    
    extractPreview: (content: string, maxWords: number = 20) => {
      const words = content.split(/\s+/);
      if (words.length <= maxWords) return content;
      return words.slice(0, maxWords).join(' ') + '...';
    }
  },
  
  // Analytics business logic
  analytics: {
    calculateGrowthRate: (current: number, previous: number) => {
      if (previous === 0) return current > 0 ? 100 : 0;
      return Math.round(((current - previous) / previous) * 100);
    },
    
    generateDateRange: (days: number) => {
      const dates = [];
      for (let i = days - 1; i >= 0; i--) {
        const date = new Date();
        date.setDate(date.getDate() - i);
        dates.push(date.toISOString().split('T')[0]);
      }
      return dates;
    },
    
    groupDataByPeriod: <T extends { created_at: string }>(
      data: T[], 
      period: 'day' | 'week' | 'month'
    ) => {
      const grouped = new Map<string, T[]>();
      
      data.forEach(item => {
        const date = new Date(item.created_at);
        let key: string;
        
        switch (period) {
          case 'day':
            key = date.toISOString().split('T')[0];
            break;
          case 'week':
            const week = Math.floor(date.getTime() / (7 * 24 * 60 * 60 * 1000));
            key = `week-${week}`;
            break;
          case 'month':
            key = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
            break;
        }
        
        if (!grouped.has(key)) {
          grouped.set(key, []);
        }
        grouped.get(key)!.push(item);
      });
      
      return grouped;
    }
  }
};
