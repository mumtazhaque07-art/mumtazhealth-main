import { Navigation } from "@/components/Navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, Shield } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";

export default function PrivacyPolicy() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background p-4 pt-24">
      <Navigation />
      <div className="max-w-3xl mx-auto space-y-6">
        <Button variant="ghost" onClick={() => navigate(-1)} className="mb-4">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back
        </Button>

        <Card className="border-none shadow-lg">
          <CardHeader className="text-center pb-8">
            <div className="mx-auto w-12 h-12 bg-wellness-lilac/20 rounded-full flex items-center justify-center mb-4">
              <Shield className="w-6 h-6 text-wellness-lilac" />
            </div>
            <CardTitle className="text-3xl font-bold font-accent text-mumtaz-plum">Privacy Policy</CardTitle>
            <p className="text-sm text-muted-foreground mt-2">Last Updated: March 2024</p>
          </CardHeader>
          <CardContent className="prose prose-sm sm:prose-base max-w-none text-muted-foreground space-y-6 leading-relaxed">
            <section>
              <h3 className="text-lg font-semibold text-foreground">1. Introduction</h3>
              <p>
                At Mumtaz Health, we take your privacy and the confidentiality of your health data with the utmost seriousness. This policy describes how we collect, use, and protect your personal wellness, biometric, and lifecycle data in compliance with international data protection standards (including GDPR principles).
              </p>
            </section>

            <section>
              <h3 className="text-lg font-semibold text-foreground">2. Sensitive Data We Collect</h3>
              <p>
                To provide a highly personalised, trauma-informed sanctuary experience, we collect:
              </p>
              <ul className="list-disc pl-5 space-y-2">
                <li><strong>Account Information:</strong> Email, username, and authentication tokens.</li>
                <li><strong>Wellness Data:</strong> Daily logs, emotional scores, pain levels, and Ayurvedic practices.</li>
                <li><strong>Lifecycle Information:</strong> Life stage, menstrual cycle details, and pregnancy/postpartum status.</li>
                <li><strong>Biometric Context:</strong> Primary and secondary Dosha profiles.</li>
              </ul>
            </section>

            <section>
              <h3 className="text-lg font-semibold text-foreground">3. How We Use Your Data</h3>
              <p>
                Your data is strictly utilized to enhance your personal healing journey. We use it to:
              </p>
              <ul className="list-disc pl-5 space-y-2">
                <li>Customise daily recommendations, yoga protocols, and Ayurvedic guidance.</li>
                <li>Provide private insights into your personal health journey over time.</li>
                <li>Ensure our Wisdom Guide provides context-aware, safe advice (e.g., filtering out unsafe poses during pregnancy).</li>
                <li>Communicate relevant updates and booking confirmations.</li>
              </ul>
            </section>

            <section>
              <h3 className="text-lg font-semibold text-foreground">4. Data Security & Storage</h3>
              <p>
                Your data is stored securely using enterprise-grade PostgreSQL databases with <strong>strict Row Level Security (RLS)</strong>. This means your sensitive health records are mathematically isolated and can only be accessed by your authenticated session. We enforce end-to-end encryption in transit and encryption at rest. <strong>We do not, and will never, sell your personal or wellness data to third parties.</strong>
              </p>
            </section>

            <section>
              <h3 className="text-lg font-semibold text-foreground">5. Your Rights (Data Sovereignty)</h3>
              <p>
                You retain complete sovereignty over your data. You have the right to:
              </p>
              <ul className="list-disc pl-5 space-y-2">
                <li>Access a full copy of your wellness history.</li>
                <li>Correct or update any inaccurate information.</li>
                <li>Permanently delete your account and all associated health records ("Right to be Forgotten") directly via the Settings menu.</li>
              </ul>
            </section>

            <div className="pt-8 border-t border-border mt-8 text-center text-xs italic">
              Questions regarding your data privacy? Contact our Data Protection Officer at <a href="mailto:mumtazhaque07@gmail.com" className="text-mumtaz-plum underline">mumtazhaque07@gmail.com</a>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
