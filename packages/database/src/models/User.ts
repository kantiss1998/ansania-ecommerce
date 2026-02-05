import {
    Model,
    DataTypes,
    InferAttributes,
    InferCreationAttributes,
    CreationOptional,
    NonAttribute,
    Association,
} from 'sequelize';
import bcrypt from 'bcryptjs';
import { sequelize } from '../config/database';

// Define User attributes interface
export interface UserAttributes {
    id: number;
    email: string;
    role: string;
    phone: string | null;
    password: string;
    full_name: string | null;
    odoo_user_id: number | null;
    odoo_partner_id: number | null;
    email_verified: boolean;
    email_verified_at: Date | null;
    created_at: Date;
    updated_at: Date;
}

// User Model
export class User extends Model<
    InferAttributes<User>,
    InferCreationAttributes<User>
> {
    // Primary key
    declare id: CreationOptional<number>;

    // User credentials
    declare email: string;
    declare role: CreationOptional<string>;
    declare phone: CreationOptional<string | null>;
    declare password: string;
    declare full_name: CreationOptional<string | null>;

    // Odoo integration
    declare odoo_user_id: CreationOptional<number | null>;
    declare odoo_partner_id: CreationOptional<number | null>;

    // Email verification
    declare email_verified: CreationOptional<boolean>;
    declare email_verified_at: CreationOptional<Date | null>;

    // Timestamps
    declare created_at: CreationOptional<Date>;
    declare updated_at: CreationOptional<Date>;

    // Associations
    declare addresses?: NonAttribute<any[]>;
    declare orders?: NonAttribute<any[]>;
    declare cart?: NonAttribute<any>;
    declare reviews?: NonAttribute<any[]>;
    declare wishlist?: NonAttribute<any[]>;
    // New associations
    declare sessions?: NonAttribute<any[]>;
    declare passwordResetTokens?: NonAttribute<any[]>;
    declare notifications?: NonAttribute<any[]>;
    declare activityLogs?: NonAttribute<any[]>;
    declare searchHistory?: NonAttribute<any[]>;
    declare views?: NonAttribute<any[]>;

    // Association declarations
    declare static associations: {
        addresses: Association<User, any>;
        orders: Association<User, any>;
        cart: Association<User, any>;
        reviews: Association<User, any>;
        wishlist: Association<User, any>;
        sessions: Association<User, any>;
        passwordResetTokens: Association<User, any>;
        notifications: Association<User, any>;
        activityLogs: Association<User, any>;
        searchHistory: Association<User, any>;
        views: Association<User, any>;
    };

    // Instance methods
    async comparePassword(candidatePassword: string): Promise<boolean> {
        return bcrypt.compare(candidatePassword, this.password);
    }

    toJSON(): Omit<UserAttributes, 'password'> {
        const values = { ...this.get() } as any;
        delete values.password;
        return values as Omit<UserAttributes, 'password'>;
    }
}

// Initialize User model
User.init(
    {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
        },
        email: {
            type: DataTypes.STRING(255),
            allowNull: false,
            unique: true,
            validate: {
                isEmail: true,
            },
        },
        role: {
            type: DataTypes.STRING(50),
            allowNull: false,
            defaultValue: 'customer',
        },
        phone: {
            type: DataTypes.STRING(20),
            allowNull: true,
            unique: true,
        },
        password: {
            type: DataTypes.STRING(255),
            allowNull: false,
        },
        full_name: {
            type: DataTypes.STRING(255),
            allowNull: true,
        },
        odoo_user_id: {
            type: DataTypes.INTEGER,
            allowNull: true,
            comment: 'Reference to Odoo user ID',
        },
        odoo_partner_id: {
            type: DataTypes.INTEGER,
            allowNull: true,
            comment: 'Reference to Odoo partner (contact) ID',
        },
        email_verified: {
            type: DataTypes.BOOLEAN,
            allowNull: false,
            defaultValue: false,
        },
        email_verified_at: {
            type: DataTypes.DATE,
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
        tableName: 'users',
        timestamps: true,
        underscored: true,
        indexes: [
            { fields: ['email'], unique: true },
            { fields: ['phone'], unique: true },
            { fields: ['odoo_user_id'] },
        ],
        hooks: {
            beforeCreate: async (user) => {
                if (user.password) {
                    const salt = await bcrypt.genSalt(10);
                    user.password = await bcrypt.hash(user.password, salt);
                }
            },
            beforeUpdate: async (user) => {
                if (user.changed('password') && user.password) {
                    const salt = await bcrypt.genSalt(10);
                    user.password = await bcrypt.hash(user.password, salt);
                }
            },
        },
    }
);

export default User;
