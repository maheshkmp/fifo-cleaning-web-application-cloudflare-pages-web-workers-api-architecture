/**
 * Google Analytics utility functions for tracking custom events
 * 
 * Usage:
 * import { trackEvent, trackPageView, trackSignup, etc. } from '@/lib/analytics'
 * 
 * trackEvent('button_click', { button_name: 'signup' })
 */

// Extend Window interface to include gtag
declare global {
  interface Window {
    gtag?: (
      command: string,
      targetId: string | Date,
      config?: Record<string, any>
    ) => void;
    dataLayer?: any[];
  }
}

/**
 * Track a custom event
 * @param eventName - The name of the event (e.g., 'signup', 'purchase')
 * @param eventParams - Additional parameters for the event
 */
export const trackEvent = (
  eventName: string,
  eventParams?: Record<string, any>
) => {
  if (typeof window !== "undefined" && window.gtag) {
    window.gtag("event", eventName, eventParams);
  }
};

/**
 * Track a page view
 * Useful for tracking SPA navigation
 * @param url - The page URL
 * @param title - The page title
 */
export const trackPageView = (url: string, title?: string) => {
  if (typeof window !== "undefined" && window.gtag) {
    window.gtag("event", "page_view", {
      page_path: url,
      page_title: title || document.title,
    });
  }
};

/**
 * Track user signup
 * @param method - The signup method (e.g., 'email', 'google', 'github')
 */
export const trackSignup = (method: string) => {
  trackEvent("sign_up", {
    method: method,
  });
};

/**
 * Track user login
 * @param method - The login method (e.g., 'email', 'google', 'github')
 */
export const trackLogin = (method: string) => {
  trackEvent("login", {
    method: method,
  });
};

/**
 * Track blog/article view
 * @param articleId - The article ID
 * @param articleTitle - The article title
 */
export const trackBlogView = (articleId: string, articleTitle: string) => {
  trackEvent("view_item", {
    item_id: articleId,
    item_name: articleTitle,
    item_category: "blog",
  });
};

/**
 * Track button click
 * @param buttonName - Name or ID of the button
 * @param location - Where the button is located (e.g., 'header', 'footer', 'pricing')
 */
export const trackButtonClick = (buttonName: string, location?: string) => {
  trackEvent("button_click", {
    button_name: buttonName,
    location: location,
  });
};

/**
 * Track purchase/subscription
 * @param planId - The plan/product ID
 * @param value - The transaction value
 * @param currency - Currency code (e.g., 'USD')
 */
export const trackPurchase = (
  planId: string,
  value: number,
  currency: string = "USD"
) => {
  trackEvent("purchase", {
    transaction_id: `${Date.now()}-${planId}`,
    value: value,
    currency: currency,
    items: [
      {
        item_id: planId,
        item_name: planId,
      },
    ],
  });
};

/**
 * Track tool usage (QR code generation, image cropping, etc.)
 * @param toolName - Name of the tool used
 * @param action - Action performed (e.g., 'generate', 'download', 'share')
 */
export const trackToolUsage = (toolName: string, action: string) => {
  trackEvent("tool_usage", {
    tool_name: toolName,
    action: action,
  });
};

/**
 * Track form submission
 * @param formName - Name of the form
 * @param formLocation - Where the form is located
 */
export const trackFormSubmit = (formName: string, formLocation?: string) => {
  trackEvent("form_submit", {
    form_name: formName,
    location: formLocation,
  });
};

/**
 * Track file download
 * @param fileName - Name of the downloaded file
 * @param fileType - Type of file (e.g., 'qr-code', 'image', 'pdf')
 */
export const trackDownload = (fileName: string, fileType: string) => {
  trackEvent("file_download", {
    file_name: fileName,
    file_type: fileType,
  });
};

/**
 * Track search query
 * @param searchTerm - The search term used
 * @param resultCount - Number of results returned
 */
export const trackSearch = (searchTerm: string, resultCount?: number) => {
  trackEvent("search", {
    search_term: searchTerm,
    result_count: resultCount,
  });
};

/**
 * Track error occurrences
 * @param errorMessage - The error message
 * @param errorLocation - Where the error occurred
 * @param isFatal - Whether the error is fatal
 */
export const trackError = (
  errorMessage: string,
  errorLocation: string,
  isFatal: boolean = false
) => {
  trackEvent("exception", {
    description: errorMessage,
    location: errorLocation,
    fatal: isFatal,
  });
};
