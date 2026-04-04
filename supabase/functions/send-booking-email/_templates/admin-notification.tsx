import {
  Body,
  Container,
  Head,
  Heading,
  Html,
  Link,
  Preview,
  Section,
  Text,
} from 'https://esm.sh/@react-email/components@0.0.15'
import * as React from 'https://esm.sh/react@18.3.1'

interface AdminNotificationEmailProps {
  userName: string
  userEmail: string
  serviceTitle: string
  bookingDate: string
  duration: string
  durationMinutes: number
  price: string
  notes?: string
  bookingId: string
  bookingDateIso?: string
}

export const AdminNotificationEmail = ({
  userName,
  userEmail,
  serviceTitle,
  bookingDate,
  duration,
  durationMinutes,
  price,
  notes,
  bookingId,
  bookingDateIso,
}: AdminNotificationEmailProps) => {
  // Format the dates for Google Calendar TEMPLATE
  // It uses YYYYMMDDTHHmmssZ format
  let calendarHref = 'https://calendar.google.com/calendar/render?action=TEMPLATE';
  
  if (bookingDateIso) {
    const startDate = new Date(bookingDateIso);
    const endDate = new Date(startDate.getTime() + durationMinutes * 60000);
    
    // Format removing -, :, and .000
    const startStr = startDate.toISOString().replace(/(-|:|\.\d+)/g, '');
    const endStr = endDate.toISOString().replace(/(-|:|\.\d+)/g, '');
    
    const details = encodeURIComponent(`Client Email: ${userEmail}\n\nNotes: ${notes || 'None provided'}`);
    calendarHref += `&text=Consultation%20with%20${encodeURIComponent(userName)}&dates=${startStr}/${endStr}&details=${details}`;
  }

  return (
  <Html>
    <Head />
    <Preview>New booking request from {userName}</Preview>
    <Body style={main}>
      <Container style={container}>
        <Heading style={h1}>🔔 New Booking Request</Heading>
        <Text style={text}>
          A new booking has been created and requires your attention.
        </Text>
        
        <Section style={detailsBox}>
          <Text style={detailLabel}>Client Name</Text>
          <Text style={detailValue}>{userName}</Text>
          
          <Text style={detailLabel}>Client Email</Text>
          <Text style={detailValue}>{userEmail}</Text>
          
          <Text style={detailLabel}>Service</Text>
          <Text style={detailValue}>{serviceTitle}</Text>
          
          <Text style={detailLabel}>Requested Date & Time</Text>
          <Text style={detailValue}>{bookingDate}</Text>
          
          <Text style={detailLabel}>Duration</Text>
          <Text style={detailValue}>{duration}</Text>
          
          <Text style={detailLabel}>Price</Text>
          <Text style={detailValue}>{price}</Text>
          
          {notes && (
            <>
              <Text style={detailLabel}>Client Notes</Text>
              <Text style={detailValue}>{notes}</Text>
            </>
          )}
          
          <Text style={detailLabel}>Booking ID</Text>
          <Text style={detailValue}>{bookingId}</Text>
        </Section>

        <Text style={text}>
          Please review and confirm this booking in your admin dashboard, or instantly add it to your schedule:
        </Text>

        {bookingDateIso && (
          <Section style={btnContainer}>
            <Link style={button} href={calendarHref}>
              Add to Google Calendar
            </Link>
          </Section>
        )}
        
        <Text style={footer}>
          <strong>Holistic Wellness Admin</strong>
        </Text>
      </Container>
    </Body>
  </Html>
  );
}

export default AdminNotificationEmail

const main = {
  backgroundColor: '#f6f9fc',
  fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", "Roboto", "Oxygen", "Ubuntu", "Cantarell", "Fira Sans", "Droid Sans", "Helvetica Neue", sans-serif',
}

const container = {
  backgroundColor: '#ffffff',
  margin: '0 auto',
  padding: '40px 20px',
  maxWidth: '600px',
  borderRadius: '8px',
}

const h1 = {
  color: '#333',
  fontSize: '28px',
  fontWeight: 'bold',
  margin: '40px 0 20px',
  padding: '0',
}

const text = {
  color: '#333',
  fontSize: '16px',
  lineHeight: '26px',
  margin: '16px 0',
}

const detailsBox = {
  backgroundColor: '#fff9f0',
  borderRadius: '8px',
  padding: '24px',
  margin: '24px 0',
  border: '1px solid #ffe8c0',
}

const detailLabel = {
  color: '#666',
  fontSize: '12px',
  fontWeight: '600',
  textTransform: 'uppercase' as const,
  letterSpacing: '0.5px',
  margin: '16px 0 4px',
}

const detailValue = {
  color: '#333',
  fontSize: '16px',
  fontWeight: '500',
  margin: '0 0 8px',
}

const footer = {
  color: '#666',
  fontSize: '14px',
  lineHeight: '22px',
  marginTop: '32px',
  paddingTop: '24px',
  borderTop: '1px solid #e8ebe8',
}

const btnContainer = {
  textAlign: 'center' as const,
  margin: '24px 0',
}

const button = {
  backgroundColor: '#4285F4',
  borderRadius: '5px',
  color: '#fff',
  fontSize: '16px',
  fontWeight: 'bold',
  textDecoration: 'none',
  padding: '12px 24px',
  display: 'inline-block',
}
