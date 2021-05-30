import {BadRequestException, Body, Controller, Get, HttpCode, HttpStatus, Inject, Param, Post} from "@nestjs/common";
import {TablesService} from "./TablesService";

@Controller({
  path: "/:namespace",
})
export class TablesController {
  public constructor(
    @Inject(TablesService) private _tablesService: TablesService
  ) {
  }

  @Get("/_meta")
  public async meta(
    @Param("namespace") namespace: string,
  ) {

    return this._tablesService.getNamespaceMeta(namespace)
  }

  @Post("/")
  @HttpCode(HttpStatus.NO_CONTENT)
  public async createTable(
    @Param("namespace") namespace: string,
    @Body() body: any,
  ) {
    const tableName = body.tableName;
    if (!tableName) {
      throw new BadRequestException("tableName must be provided");
    }

    await this._tablesService.ensureTableExists(namespace, tableName);

    return;
  }


  @Post("/:tableName")
  public async createEntityInTable(
    @Param("namespace") namespace: string,
    @Param("tableName") tableName: string,
    @Body() entity: any
  ) {
    if (!entity) {
      throw new BadRequestException("entity must be provided");
    }

    if (entity._id) {
      throw new BadRequestException("_id is a reserved property");
    }

    await this._tablesService.createEntity(namespace, tableName, entity);

    return entity;
  }

  @Get("/:tableName/:entityId")
  public async getEntityFromTable(
    @Param("namespace") namespace: string,
    @Param("tableName") tableName: string,
    @Param("entityId") entityId: string
  ) {

    return this._tablesService.retrieveEntity(namespace, tableName, entityId);
  }

  @Get("/:tableName")
  public async queryEntitiesInTable(
    @Param("namespace") namespace: string,
    @Param("tableName") tableName: string
  ) {
    return this._tablesService.queryEntitiesInTable(namespace, tableName);
  }

  // TODO: DELETE /:tableName
  // TODO: PUT /:tableName/:entityId
  // TODO: PATCH /:tableName/:entityId
  // TODO: DELETE /:tableName/:entityId

}
