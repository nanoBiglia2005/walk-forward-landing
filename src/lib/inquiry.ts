export type Inquiry = {
  name: string;
  email: string;
  country: string;
  city: string;
  source: string;
  sector: string;
  message: string;
};

/**
 * Sends a contact inquiry.
 *
 * Pending: the site is a static export (WNPower) and the email service is not chosen yet
 * (Formspree, Web3Forms or EmailJS, called from the browser). Until it is connected this only
 * simulates the request, so nothing reaches the client's inbox — connect it before publishing.
 */
export async function sendInquiry(inquiry: Inquiry): Promise<void> {
  void inquiry;
  await new Promise((resolve) => setTimeout(resolve, 600));
}
