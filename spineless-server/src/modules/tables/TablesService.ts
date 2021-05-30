import { Injectable } from "@nestjs/common";
import DynamoDB from 'aws-sdk/clients/dynamodb';

@Injectable()
export class TablesService {
  private _dynamo: DynamoDB;

  constructor() {
    this._dynamo = new DynamoDB({
      region: "ap-southeast-2"
    });

    // console.log(process.env.DB_SPINELESS_TABLES);
    // console.log(process.env.DB_SPINELESS_DATA);
  }


}
