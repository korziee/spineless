export interface ISerializable {
  serialize(): { [key: string]: any };
  // public static unserialize(obj: any): any {}
}

export interface ISerializableClass<T extends ISerializable> {
  unserialize: (val: any) => T;
}

export function isSerializable(x: any): x is ISerializable {
  return x !== null && typeof x.serialize === "function";
}
