// src/components/utilsDir/dateUtils.jsx
const DateUtils = {
  calculateDaysUntilEvent: (eventDate) => {
    const today = new Date();
    const eventDateTime = new Date(eventDate);
    const timeDiff = eventDateTime.getTime() - today.getTime();
    const daysDiff = Math.ceil(timeDiff / (1000 * 3600 * 24));
    return daysDiff > 0 ? daysDiff : 0;
  },

  formatDate: (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  }
};

export default DateUtils;
