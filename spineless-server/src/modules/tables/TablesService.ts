import {Injectable} from "@nestjs/common";
import {
  DeleteItemCommand,
  DynamoDBClient,
  GetItemCommand,
  PutItemCommand,
  QueryCommand
} from "@aws-sdk/client-dynamodb";

import {INamespaceMeta} from "../../types/INamespaceMeta";
import {createGuid} from "../../util/guid";
import {IQueryResult} from "../../types/IQueryResult";

const DB_SPINELESS_TABLES = process.env.DB_SPINELESS_TABLES;
const DB_SPINELESS_DATA = process.env.DB_SPINELESS_DATA;

@Injectable()
export class TablesService {
  private _dynamo: DynamoDBClient;

  constructor() {
    this._dynamo = new DynamoDBClient({
      region: "ap-southeast-2"
    });
  }

  public async getNamespaceMeta(namespace: string): Promise<INamespaceMeta> {
    const response = await this._dynamo.send(
      new QueryCommand(
        {
          TableName: DB_SPINELESS_TABLES,
          KeyConditionExpression: "namespace = :namespace",
          ExpressionAttributeValues: {
            ":namespace": {S: namespace}
          }
        }
      )
    );

    const tables = await Promise.all(response.Items.map(async ({table}) => {
      const tableName = table.S;
      const entityCount = await this.retrieveNumberOfEntitiesInTable(namespace, tableName);

      return {
        tableName,
        entityCount
      };
    }));

    return {
      tables
    };
  }

  private async retrieveNumberOfEntitiesInTable(namespace: string, tableName: string): Promise<number> {
    const namespacedTable = `${namespace}/${tableName}`;

    const response = await this._dynamo.send(
      new QueryCommand(
        {
          TableName: DB_SPINELESS_DATA,
          KeyConditionExpression: "namespaced_table = :namespaced_table",
          ExpressionAttributeValues: {
            ":namespaced_table": {S: namespacedTable}
          },
          Select: "COUNT"
        }
      )
    );

    return response.Count;
  }

  /**
   * Ensures spineless_tables record exists
   */
  public async ensureTableExists(namespace: string, tableName: string): Promise<void> {
    // create entry in spineless_tables
    // PutItem won't error if already existing
    await this._dynamo.send(
      new PutItemCommand(
        {
          TableName: DB_SPINELESS_TABLES,
          Item: {
            namespace: {S: namespace},
            table: {S: tableName},
          }
        })
    );
  }

  public ensureTableExistsInBackground(namespace: string, tableName: string): void {
    this.ensureTableExists(namespace, tableName).catch(console.error);
  }

  // returns entity id
  public async createEntity(namespace: string, tableName: string, entity: any): Promise<string> {
    // populate _id property
    entity._id = createGuid(32).toLowerCase();

    // ensure table exists
    this.ensureTableExistsInBackground(namespace, tableName);

    const namespaced_table = `${namespace}/${tableName}`;

    // store entity in spineless_data table
    await this._dynamo.send(
      new PutItemCommand(
        {
          TableName: DB_SPINELESS_DATA,
          Item: {
            namespaced_table: {S: namespaced_table},
            id: {S: entity._id},
            data: {S: JSON.stringify(entity)}
          }
        })
    );

    // return entity id
    return entity._id;
  }

  public async retrieveEntity(namespace: string, tableName: string, entityId: string): Promise<any | null> {
    const namespacedTable = `${namespace}/${tableName}`;

    // fetch entity by (partition -> namespace/tablename, sort -> entityId)
    const entity = await this._dynamo.send(
      new GetItemCommand(
        {
          TableName: DB_SPINELESS_DATA,
          Key: {
            "namespaced_table": {S: namespacedTable},
            "id": {S: entityId}
          }
        })
    );

    return entity.Item ? JSON.parse(entity.Item.data.S) : null;
  }

  public async queryEntitiesInTable(
    namespace: string,
    tableName: string
  ): Promise<IQueryResult> {
    const namespacedTable = `${namespace}/${tableName}`;

    const response = await this._dynamo.send(
      new QueryCommand(
        {
          TableName: DB_SPINELESS_DATA,
          KeyConditionExpression: "namespaced_table = :namespaced_table",
          ExpressionAttributeValues: {
            ":namespaced_table": {S: namespacedTable}
          }
        }
      )
    );

    const items = response.Items.map(x => JSON.parse(x.data.S));

    return {
      items,
      _meta: {
        total: response.Count,
        returned: response.Count,
        skipped: 0
      }
    }
  }

  public async updateEntity(namespace: string, tableName: string, entityId: string, updatedEntity: any): Promise<void> {
    // ensure table exists
    this.ensureTableExistsInBackground(namespace, tableName);

    // ensure the ID isn't being modified
    updatedEntity._id = entityId;

    const namespaced_table = `${namespace}/${tableName}`;

    // store entity in spineless_data table
    await this._dynamo.send(
      new PutItemCommand(
        {
          TableName: DB_SPINELESS_DATA,
          Item: {
            namespaced_table: {S: namespaced_table},
            id: {S: updatedEntity._id},
            data: {S: JSON.stringify(updatedEntity)}
          }
        })
    );
  }

  public async deleteEntity(namespace: string, tableName: string, entityId: string): Promise<void> {
    const namespacedTable = `${namespace}/${tableName}`;

    await this._dynamo.send(
      new DeleteItemCommand(
        {
          TableName: DB_SPINELESS_DATA,
          Key: {
            "namespaced_table": {S: namespacedTable},
            "id": {S: entityId}
          }
        }
      )
    );
  }

  // aws dynamodb query --table-name spineless-stack-spinelesstablesC56DD956-OC73QQHRVP8B --key-condition-expression "namespace = :namespace" --expression-attribute-values '{ ":namespace": { "S": "asdf" } }' --select  "COUNT"
}
