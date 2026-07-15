import {
  Body,
  Container,
  Head,
  Heading,
  Html,
  Preview,
  Section,
  Text,
} from 'https://esm.sh/@react-email/components@0.0.15'
import * as React from 'https://esm.sh/react@18.3.1'

interface ChatNotificationEmailProps {
  userName: string
  userEmail: string
  messagePreview: string
}

export const ChatNotificationEmail = ({
  userName,
  userEmail,
  messagePreview,
}: ChatNotificationEmailProps) => {

  return (
  <Html>
    <Head />
    <Preview>New direct message from {userName}</Preview>
    <Body style={main}>
      <Container style={container}>
        <Heading style={h1}>📩 New Direct Message</Heading>
        <Text style={text}>
          A user has sent you a new message in their private coaching inbox.
        </Text>
        
        <Section style={detailsBox}>
          <Text style={detailLabel}>Student Name</Text>
          <Text style={detailValue}>{userName}</Text>
          
          <Text style={detailLabel}>Student Email</Text>
          <Text style={detailValue}>{userEmail}</Text>
          
          <Text style={detailLabel}>Message Preview</Text>
          <Text style={detailValue}>"{messagePreview}"</Text>
        </Section>

        <Text style={text}>
          Please log into your Admin Dashboard to read the full message and reply directly.
        </Text>
        
        <Text style={footer}>
          <strong>Mumtaz Health Admin Notifications</strong>
        </Text>
      </Container>
    </Body>
  </Html>
  );
}

export default ChatNotificationEmail

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
  backgroundColor: '#EEF3ED',
  borderRadius: '8px',
  padding: '24px',
  margin: '24px 0',
  border: '1px solid #7A9684',
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
