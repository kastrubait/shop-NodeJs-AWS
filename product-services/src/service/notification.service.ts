import { SNS } from "@aws-sdk/client-sns";
import { Product } from "../model/product-model";

export class NotificationService {
  private topicArn: string = process.env.SNS_ARN;
  private sns: SNS = new SNS({ region: "eu-west-1" });

  async notify(product: Product): Promise<void> {
    await this.sns.publish(
      {
        Subject: "Imported file processing info",
        Message: `Product ${product.title} successfully added to DB`,
        TopicArn: this.topicArn,
      },
      this.publishCallback()
      );
      }
    
      private publishCallback() {
        return (error, data) => {
          console.log("notify callback data", data);
          if (error) {
            console.log("notify callback error", error);
          }
        };
      }
    }