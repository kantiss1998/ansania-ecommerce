import {
    Model,
    DataTypes,
    InferAttributes,
    InferCreationAttributes,
    CreationOptional,
    ForeignKey,
    NonAttribute,
    Association,
} from 'sequelize';
import { sequelize } from '../config/database';
import { User } from './User';

export interface AddressAttributes {
    id: number;
    user_id: number;
    label: string | null;
    recipient_name: string;
    phone: string;
    address_line1: string;
    address_line2: string | null;
    city: string;
    district: string | null;
    subdistrict: string | null;
    province: string;
    postal_code: string;
    is_default: boolean;
    latitude: number | null;
    longitude: number | null;
    created_at: Date;
    updated_at: Date;
}

export class Address extends Model<
    InferAttributes<Address>,
    InferCreationAttributes<Address>
> {
    declare id: CreationOptional<number>;
    declare user_id: ForeignKey<User['id']>;

    declare label: string | null;
    declare recipient_name: string;
    declare phone: string;
    declare address_line1: string;
    declare address_line2: string | null;
    declare city: string;
    declare district: string | null;
    declare subdistrict: string | null;
    declare province: string;
    declare postal_code: string;
    declare is_default: CreationOptional<boolean>;
    declare latitude: number | null;
    declare longitude: number | null;

    declare created_at: CreationOptional<Date>;
    declare updated_at: CreationOptional<Date>;

    // Associations
    declare user?: NonAttribute<User>;
    declare static associations: {
        user: Association<Address, User>;
    };
}

Address.init(
    {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
        },
        user_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: 'users',
                key: 'id',
            },
            onDelete: 'CASCADE',
        },
        label: {
            type: DataTypes.STRING(50),
            allowNull: true,
            comment: 'e.g., Home, Office, etc.',
        },
        recipient_name: {
            type: DataTypes.STRING(255),
            allowNull: false,
        },
        phone: {
            type: DataTypes.STRING(20),
            allowNull: false,
        },
        address_line1: {
            type: DataTypes.TEXT,
            allowNull: false,
        },
        address_line2: {
            type: DataTypes.TEXT,
            allowNull: true,
        },
        city: {
            type: DataTypes.STRING(100),
            allowNull: false,
        },
        district: {
            type: DataTypes.STRING(100),
            allowNull: true,
        },
        subdistrict: {
            type: DataTypes.STRING(100),
            allowNull: true,
        },
        province: {
            type: DataTypes.STRING(100),
            allowNull: false,
        },
        postal_code: {
            type: DataTypes.STRING(10),
            allowNull: false,
        },
        is_default: {
            type: DataTypes.BOOLEAN,
            allowNull: false,
            defaultValue: false,
        },
        latitude: {
            type: DataTypes.DECIMAL(10, 8),
            allowNull: true,
        },
        longitude: {
            type: DataTypes.DECIMAL(11, 8),
            allowNull: true,
        },
        created_at: {
            type: DataTypes.DATE,
            allowNull: false,
            defaultValue: DataTypes.NOW,
        },
        updated_at: {
            type: DataTypes.DATE,
            allowNull: false,
            defaultValue: DataTypes.NOW,
        },
    },
    {
        sequelize,
        tableName: 'addresses',
        timestamps: true,
        underscored: true,
        indexes: [
            { fields: ['user_id'] },
            { fields: ['is_default'] },
        ],
    }
);

export default Address;
