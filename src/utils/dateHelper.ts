// Date formatting utility functions

export const formatDate = (dateString: string): string => {
  try {
    const date = new Date(dateString);

    // Check if date is valid
    if (isNaN(date.getTime())) {
      return dateString; // Return original string if invalid
    }

    const now = new Date();
    const diffInMs = now.getTime() - date.getTime();
    const diffInMinutes = Math.floor(diffInMs / (1000 * 60));
    const diffInHours = Math.floor(diffInMs / (1000 * 60 * 60));
    const diffInDays = Math.floor(diffInMs / (1000 * 60 * 60 * 24));

    // Relative time for recent dates
    if (diffInMinutes < 1) {
      return 'Azgina';
    } else if (diffInMinutes < 60) {
      return `${diffInMinutes} daqiqa oldin`;
    } else if (diffInHours < 24) {
      return `${diffInHours} soat oldin`;
    } else if (diffInDays < 7) {
      return `${diffInDays} kun oldin`;
    } else {
      // Format as date for older entries
      return date.toLocaleDateString('uz-UZ', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      });
    }
  } catch (error) {
    console.error('Date formatting error:', error);
    return dateString; // Return original string on error
  }
};

export const formatDateShort = (dateString: string): string => {
  try {
    const date = new Date(dateString);

    if (isNaN(date.getTime())) {
      return dateString;
    }

    return date.toLocaleDateString('uz-UZ', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  } catch (error) {
    console.error('Date formatting error:', error);
    return dateString;
  }
};

export const formatDateFull = (dateString: string): string => {
  try {
    const date = new Date(dateString);

    if (isNaN(date.getTime())) {
      return dateString;
    }

    return date.toLocaleDateString('uz-UZ', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  } catch (error) {
    console.error('Date formatting error:', error);
    return dateString;
  }
};

export const formatDateCompact = (dateString: string): string => {
  try {
    const date = new Date(dateString);

    if (isNaN(date.getTime())) {
      return dateString;
    }

    const day = date.getDate();
    const month = date.getMonth() + 1;
    const year = date.getFullYear();
    const hours = date.getHours().toString().padStart(2, '0');
    const minutes = date.getMinutes().toString().padStart(2, '0');

    return `${day}-${month}-${year}, ${hours}:${minutes}`;
  } catch (error) {
    console.error('Date formatting error:', error);
    return dateString;
  }
};
