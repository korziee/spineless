import { ISerializable } from "./ISerializable";
import { guid } from "./guid";

export class Example implements ISerializable {
  public exampleId: guid;

  public serialize() {
    return {
      exampleId: this.exampleId,
    };
  }

  public static unserialize(data: any) {
    const newObj = new Example();
    newObj.exampleId = data.exampleId;

    return newObj;
  }

  public getSpecialUrl() {
    return `/api/v1/content/${this.exampleId}/special`;
  }
}
