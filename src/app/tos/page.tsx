import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function TermsOfServicePage() {
  return (
    <div className="container mx-auto py-12 px-4 max-w-4xl flex-1 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <Card className="border-primary/20 shadow-sm">
        <CardHeader>
          <CardTitle className="text-3xl text-primary font-bold">
            Terms of Service
          </CardTitle>
        </CardHeader>
        <CardContent className="prose prose-blue dark:prose-invert max-w-none">
          <h3>1. Acceptance of Terms</h3>
          <p>
            By accessing and using the Sports Equipment Tracker application, you
            agree to be bound by these Terms of Service. If you disagree with
            any part of these terms, please do not use our service.
          </p>

          <h3>2. Use of Service</h3>
          <p>
            You agree to use this application only for its intended purpose:
            tracking sports equipment and guest rentals. Any misuse,
            unauthorized access, or scraping of the database is strictly
            prohibited.
          </p>

          <h3>3. Data Accuracy</h3>
          <p>
            Users are responsible for the accuracy of the data entered into the
            system. We are not liable for lost equipment resulting from
            incorrect logging or missed returns.
          </p>

          <h3>4. Modifications</h3>
          <p>
            We reserve the right to modify or replace these Terms at any time.
            Continued use of the application after any such changes shall
            constitute your consent to such changes.
          </p>

          <p className="text-sm text-muted-foreground mt-8">
            Last updated: 2026
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
