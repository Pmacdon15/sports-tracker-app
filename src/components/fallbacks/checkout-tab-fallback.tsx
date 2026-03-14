import { ArrowRightIcon } from "lucide-react";
import { Button } from "../ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "../ui/card";
import { Label } from "../ui/label";
import { TabsContent } from "../ui/tabs";

export default function CheckoutTabFallback() {
  return (
    <TabsContent value="checkout">
      <Card className="shadow-sm border-primary/20">
        <CardHeader>
          <CardTitle className="text-2xl text-primary">
            Checkout Equipment
          </CardTitle>
          <CardDescription>
            Select a guest and an available unit to send out.
          </CardDescription>
        </CardHeader>
        <form>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <Label>Guest Name</Label>
              {/* <Combobox
                
                value={""}
                onValueChange={}
                placeholder="Select or Type Guest Name..."
                allowCustom={true}
              /> */}
            </div>

            <div className="space-y-2">
              <Label>Unit Number / Type</Label>
              {/* <Combobox
                
                value={''}
                onValueChange={}
                placeholder="Select Available Unit..."
                allowCustom={true}
              /> */}
            </div>
          </CardContent>
          <CardFooter>
            <Button
              type="submit"
              disabled={true}
              className="w-full font-semibold text-lg py-6 shadow-md shadow-primary/20 gap-2"
            >
              <ArrowRightIcon className="w-5 h-5" />
              Send Out
            </Button>
          </CardFooter>
        </form>
      </Card>
    </TabsContent>
  );
}
