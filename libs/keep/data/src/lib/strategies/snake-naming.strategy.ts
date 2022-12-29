import {DefaultNamingStrategy, NamingStrategyInterface} from 'typeorm'
import {snakeCase} from 'typeorm/util/StringUtils'

export class SnakeNamingStrategy
  extends DefaultNamingStrategy
  implements NamingStrategyInterface
{
  tableName(className: string, customName?: string) {
    return customName ? customName : snakeCase(className)
  }

  columnName(
    propertyName: string,
    customName?: string,
    embeddedPrefixes: string[] = []
  ) {
    const embeddedPrefix = embeddedPrefixes.concat('').join('_')

    let customOrPropertyName: string

    if (customName) customOrPropertyName = customName
    else customOrPropertyName = snakeCase(propertyName)

    return snakeCase(embeddedPrefix) + customOrPropertyName
  }

  relationName(propertyName: string) {
    return snakeCase(propertyName)
  }

  joinColumnName(relationName: string, referencedColumnName: string) {
    return snakeCase(`${relationName}_${referencedColumnName}`)
  }

  joinTableName(
    firstTableName: string,
    secondTableName: string,
    firstPropertyName: string
  ) {
    firstPropertyName = firstPropertyName.replace(/\./gi, '_')

    return snakeCase(
      `${firstTableName}_${firstPropertyName}_${secondTableName}`
    )
  }

  joinTableColumnName(
    tableName: string,
    propertyName: string,
    columnName?: string
  ) {
    const columnOrPropertyName = columnName ? columnName : propertyName

    return snakeCase(`${tableName}_${columnOrPropertyName}`)
  }

  classTableInheritanceParentColumnName(
    parentTableName: string,
    parentTableIdPropertyName: string
  ) {
    return snakeCase(`${parentTableName}_${parentTableIdPropertyName}`)
  }

  eagerJoinRelationAlias(alias: string, propertyPath: string) {
    propertyPath = propertyPath.replace('.', '_')

    return `${alias}__${propertyPath}`
  }
}
