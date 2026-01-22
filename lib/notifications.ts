import prisma from "./prisma";

/**
 * Simple notifications framework for sending Email/SMS/WhatsApp and saving to DB.
 */

type NotificationType = "EMAIL" | "SMS" | "WHATSAPP";
type AlertType = "INFO" | "SUCCESS" | "WARNING" | "ERROR";

interface NotificationPayload {
  to: string;
  subject?: string;
  body: string;
  type: NotificationType;
  // DB specific
  title?: string;
  userId?: string;
  businessId?: string;
  alertType?: AlertType;
}

export async function createDbNotification({ title, body, userId, businessId, alertType = "INFO" }: Partial<NotificationPayload>) {
  if (!businessId) return null;
  
  try {
    return await prisma.notification.create({
      data: {
        title: title || "New Notification",
        message: body || "",
        type: alertType,
        userId: userId || null,
        businessId: businessId,
      }
    });
  } catch (error) {
    console.error("Failed to create DB notification:", error);
    return null;
  }
}

export async function sendNotification({ to, subject, body, type, ...dbData }: NotificationPayload) {
  console.log(`[NOTIFICATION][${type}] To: ${to} | Subject: ${subject || "N/A"}`);
  console.log(`Body: ${body}`);

  // Save to DB if info provided
  if (dbData.businessId) {
    await createDbNotification({ body, ...dbData });
  }
  
  return { success: true, messageId: `msg_${Date.now()}` };
}

export async function notifyBookingConfirmation(
  customerName: string, 
  phone: string, 
  eventName: string, 
  date: string,
  businessId: string,
  userId?: string
) {
  const title = "Booking Confirmed";
  const body = `Hi ${customerName}, your booking for "${eventName}" on ${date} is confirmed!`;
  
  return sendNotification({
    to: phone,
    title,
    body,
    type: "WHATSAPP",
    businessId,
    userId,
    alertType: "SUCCESS"
  });
}

export async function notifyInquiryReceived(
  businessName: string, 
  customerName: string, 
  phone: string,
  businessId: string,
  adminUserId?: string
) {
  const title = "New Inquiry";
  const body = `New inquiry received from ${customerName} (${phone}) for ${businessName}.`;
  
  // Notify admin via WhatsApp and DB
  return sendNotification({
    to: "admin", 
    title,
    body,
    type: "WHATSAPP",
    businessId,
    userId: adminUserId, // If we have a specific admin to notify
    alertType: "INFO"
  });
}
