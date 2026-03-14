import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function PrivacyPolicyPage() {
  return (
    <div className="container mx-auto py-12 px-4 max-w-4xl flex-1 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <Card className="border-primary/20 shadow-sm">
        <CardHeader>
          <CardTitle className="text-3xl text-primary font-bold">
            Privacy Policy
          </CardTitle>
        </CardHeader>
        <CardContent className="prose prose-blue dark:prose-invert max-w-none">
          <h3>Information Collection</h3>
          <p>
            We collect information you directly provide to us, such as guest
            names and equipment statuses. We use standard secure Authentication
            providers (Clerk) to manage access securely.
          </p>

          <h3>Use of Information</h3>
          <p>
            The information collected is strictly used to facilitate the
            tracking and management of sports equipment. We do not sell or share
            your rental data with third-party advertisers.
          </p>

          <h3>Data Security</h3>
          <p>
            We implement robust standard SQL practices and authentication gates
            to maintain the safety of your rental information.
          </p>

          <h3>User Rights</h3>
          <p>
            You have the right to request deletion of your data or correction of
            inaccurate records by accessing the application settings or
            contacting an administrator.
          </p>

          <p className="text-sm text-muted-foreground mt-8">
            Last updated: 2026
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
