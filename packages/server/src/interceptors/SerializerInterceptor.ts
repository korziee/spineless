import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from "@nestjs/common";
import { Observable } from "rxjs";
import { map } from "rxjs/operators";
import {
  ISerializable,
  isSerializable,
} from "@monorepo-template/shared/dist/types/ISerializable";
import { hasSensitiveData } from "@monorepo-template/shared/dist/types/ISensitiveData";

@Injectable()
export class SerializerInterceptor implements NestInterceptor {
  public intercept(
    context: ExecutionContext,
    next: CallHandler<any>
  ): Observable<any> | Promise<Observable<any>> {
    return next.handle().pipe(
      map((data) => {
        if (typeof data !== "object" || data === null) {
          return data;
        }

        const processValue = (val: any) => {
          // check if object itself is serializable
          if (isSerializable(val)) {
            return this.serializeItem(val);
          }

          // if not, check if we are returning an array
          if (Array.isArray(val) && val.length > 0 && isSerializable(val[0])) {
            // serialise each item
            return val.map((x) => this.serializeItem(x));
          }

          return val;
        };

        // process main value
        const mainVal = processValue(data);
        if (mainVal === data && !Array.isArray(mainVal)) {
          // nothing was changed, might be an object of serializable values/arrays
          // check if the item is an object of values, and serialise each property
          Object.keys(mainVal).forEach(
            (key) => (mainVal[key] = processValue(mainVal[key]))
          );
        }

        return mainVal;
      })
    );
  }

  private serializeItem(x: ISerializable): any {
    if (hasSensitiveData(x)) {
      x = x.filterSensitiveData();
    }

    return x.serialize();
  }
}
