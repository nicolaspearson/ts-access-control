import { Action, Possession } from '../enums';
import { AccessControlError } from '../error';
import { IQueryInfo } from '../interfaces';
import { Permission } from '../permission';
import { type } from '../utils';

// tslint:disable function-name variable-name

/**
 * Represents the inner `Query` class that helps build an access information
 * for querying and checking permissions, from the underlying grants model.
 * You can get a first instance of this class by calling `AccessControl#can(<role>)`
 * method.
 */
export class Query {
  /**
   * Inner `IQueryInfo` object.
   */
  protected _: IQueryInfo = {};

  /**
   * Main grants object.
   */
  protected _grants: any;

  /**
   * Initializes a new instance of `Query`.
   *
   * @param {Any} grants Underlying grants model against which the permissions will be
   * queried and checked.
   * @param {string|Array<String>|IQueryInfo} [roleOrInfo] Either a single or array
   * of roles or an `IQueryInfo` arbitrary object.
   */
  constructor(grants: any, roleOrInfo?: string | string[] | IQueryInfo) {
    this._grants = grants;

    if (typeof roleOrInfo === 'string' || Array.isArray(roleOrInfo)) {
      // if this is just role(s); a string or array; we start building
      // the grant object for this.
      this.role(roleOrInfo);
    } else if (type(roleOrInfo) === 'object') {
      // if this is a (permission) object, we directly build attributes
      // from grants.
      if (Object.keys(roleOrInfo!).length === 0) {
        throw new AccessControlError('Invalid IQueryInfo: {}');
      }
      this._ = roleOrInfo as IQueryInfo;
    } else if (roleOrInfo !== undefined) {
      // undefined is allowed (`role` can be omitted) but throw if some
      // other type is passed.
      throw new AccessControlError(
        'Invalid role(s), expected a valid string, string[] or IQueryInfo.',
      );
    }
  }

  /**
   * A chaining method that sets the role(s) for this `Query` instance.
   * @param {String|Array<String>} roles A single or array of roles.
   * @returns {Query} Self instance of `Query`.
   */
  role(role: string | string[]): Query {
    this._.role = role;
    return this;
  }

  /**
   * A chaining method that sets the resource for this `Query` instance.
   * @param {String} resource Target resource for this `Query` instance.
   * @returns {Query} Self instance of `Query`.
   */
  resource(resource: string): Query {
    this._.resource = resource;
    return this;
  }

  /**
   * Queries the underlying grant model and checks whether the current
   * role(s) can "create" their "own" resource.
   *
   * @param {String} [resource]
   *        Defines the target resource to be checked.
   *        This is only optional if the target resource is previously
   *        defined. If not defined and omitted, this will throw.
   * @throws {Error} If the access query instance to be committed has any
   * invalid data.
   * @returns {Permission}
   *          An object that defines whether the permission is granted; and
   *          the resource attributes that the permission is granted for.
   */
  createOwn(resource?: string): Permission {
    return this._getPermission(Action.CREATE, Possession.OWN, resource);
  }

  /**
   * Queries the underlying grant model and checks whether the current
   * role(s) can "create" "any" resource.
   *
   * @param {String} [resource]
   *        Defines the target resource to be checked.
   *        This is only optional if the target resource is previously
   *        defined. If not defined and omitted, this will throw.
   * @throws {Error} If the access query instance to be committed has any
   * invalid data.
   * @returns {Permission}
   *          An object that defines whether the permission is granted; and
   *          the resource attributes that the permission is granted for.
   */
  createAny(resource?: string): Permission {
    return this._getPermission(Action.CREATE, Possession.ANY, resource);
  }

  /**
   * Alias of `createAny`
   */
  create(resource?: string): Permission {
    return this.createAny(resource);
  }

  /**
   * Queries the underlying grant model and checks whether the current
   * role(s) can "read" their "own" resource.
   *
   * @param {String} [resource]
   *        Defines the target resource to be checked.
   *        This is only optional if the target resource is previously
   *        defined. If not defined and omitted, this will throw.
   * @throws {Error} If the access query instance to be committed has any
   * invalid data.
   * @returns {Permission}
   *          An object that defines whether the permission is granted; and
   *          the resource attributes that the permission is granted for.
   */
  readOwn(resource?: string): Permission {
    return this._getPermission(Action.READ, Possession.OWN, resource);
  }

  /**
   * Queries the underlying grant model and checks whether the current
   * role(s) can "read" "any" resource.
   *
   * @param {String} [resource]
   *        Defines the target resource to be checked.
   *        This is only optional if the target resource is previously
   *        defined. If not defined and omitted, this will throw.
   * @throws {Error} If the access query instance to be committed has any
   * invalid data.
   * @returns {Permission}
   *          An object that defines whether the permission is granted; and
   *          the resource attributes that the permission is granted for.
   */
  readAny(resource?: string): Permission {
    return this._getPermission(Action.READ, Possession.ANY, resource);
  }
  /**
   * Alias of `readAny`
   */
  read(resource?: string): Permission {
    return this.readAny(resource);
  }

  /**
   * Queries the underlying grant model and checks whether the current
   * role(s) can "update" their "own" resource.
   *
   * @param {String} [resource]
   *        Defines the target resource to be checked.
   *        This is only optional if the target resource is previously
   *        defined. If not defined and omitted, this will throw.
   * @throws {Error} If the access query instance to be committed has any
   * invalid data.
   * @returns {Permission}
   *          An object that defines whether the permission is granted; and
   *          the resource attributes that the permission is granted for.
   */
  updateOwn(resource?: string): Permission {
    return this._getPermission(Action.UPDATE, Possession.OWN, resource);
  }

  /**
   * Queries the underlying grant model and checks whether the current
   * role(s) can "update" "any" resource.
   *
   * @param {String} [resource]
   *        Defines the target resource to be checked.
   *        This is only optional if the target resource is previously
   *        defined. If not defined and omitted, this will throw.
   * @throws {Error} If the access query instance to be committed has any
   * invalid data.
   * @returns {Permission}
   *          An object that defines whether the permission is granted; and
   *          the resource attributes that the permission is granted for.
   */
  updateAny(resource?: string): Permission {
    return this._getPermission(Action.UPDATE, Possession.ANY, resource);
  }
  /**
   * Alias of `updateAny`
   */
  update(resource?: string): Permission {
    return this.updateAny(resource);
  }

  /**
   * Queries the underlying grant model and checks whether the current
   * role(s) can "delete" their "own" resource.
   *
   * @param {String} [resource]
   *        Defines the target resource to be checked.
   *        This is only optional if the target resource is previously
   *        defined. If not defined and omitted, this will throw.
   * @throws {Error} If the access query instance to be committed has any
   * invalid data.
   * @returns {Permission}
   *          An object that defines whether the permission is granted; and
   *          the resource attributes that the permission is granted for.
   */
  deleteOwn(resource?: string): Permission {
    return this._getPermission(Action.DELETE, Possession.OWN, resource);
  }

  /**
   * Queries the underlying grant model and checks whether the current
   * role(s) can "delete" "any" resource.
   *
   * @param {String} [resource]
   *        Defines the target resource to be checked.
   *        This is only optional if the target resource is previously
   *        defined. If not defined and omitted, this will throw.
   * @throws {Error} If the access query instance to be committed has any
   * invalid data.
   * @returns {Permission}
   *          An object that defines whether the permission is granted; and
   *          the resource attributes that the permission is granted for.
   */
  deleteAny(resource?: string): Permission {
    return this._getPermission(Action.DELETE, Possession.ANY, resource);
  }
  /**
   * Alias of `deleteAny`
   */
  delete(resource?: string): Permission {
    return this.deleteAny(resource);
  }

  private _getPermission(action: string, possession: string, resource?: string): Permission {
    this._.action = action;
    this._.possession = possession;
    if (resource) this._.resource = resource;
    return new Permission(this._grants, this._);
  }
}
