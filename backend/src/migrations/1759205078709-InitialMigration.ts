import { MigrationInterface, QueryRunner } from "typeorm";

export class InitialMigration1759205078709 implements MigrationInterface {
    name = 'InitialMigration1759205078709'

    public async up(queryRunner: QueryRunner): Promise<void> {
        // Create enums first
        await queryRunner.query(`CREATE TYPE "public"."users_role_enum" AS ENUM('requester', 'agent', 'manager')`);
        await queryRunner.query(`CREATE TYPE "public"."category_fields_field_type_enum" AS ENUM('text', 'textarea', 'number', 'email', 'phone', 'date', 'datetime', 'select', 'checkbox', 'radio')`);
        await queryRunner.query(`CREATE TYPE "public"."sla_alerts_alert_type_enum" AS ENUM('first_response_overdue', 'resolution_overdue', 'first_response_warning', 'resolution_warning')`);

        // Create users table
        await queryRunner.query(`CREATE TABLE "users" (
            "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
            "name" character varying NOT NULL,
            "email" character varying NOT NULL,
            "password_hash" character varying NOT NULL,
            "role" "public"."users_role_enum" NOT NULL DEFAULT 'requester',
            "created_at" TIMESTAMP NOT NULL DEFAULT now(),
            "updated_at" TIMESTAMP NOT NULL DEFAULT now(),
            CONSTRAINT "UQ_users_email" UNIQUE ("email"),
            CONSTRAINT "PK_users_id" PRIMARY KEY ("id")
        )`);

        // Create categories table
        await queryRunner.query(`CREATE TABLE "categories" (
            "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
            "name" character varying NOT NULL,
            "description" text,
            "created_by_id" uuid NOT NULL,
            "created_at" TIMESTAMP NOT NULL DEFAULT now(),
            CONSTRAINT "PK_categories_id" PRIMARY KEY ("id")
        )`);

        // Create category_fields table
        await queryRunner.query(`CREATE TABLE "category_fields" (
            "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
            "category_id" uuid NOT NULL,
            "field_name" character varying NOT NULL,
            "field_type" "public"."category_fields_field_type_enum" NOT NULL,
            "is_required" boolean NOT NULL DEFAULT false,
            CONSTRAINT "PK_category_fields_id" PRIMARY KEY ("id")
        )`);

        // Create ticket_priorities table
        await queryRunner.query(`CREATE TABLE "ticket_priorities" (
            "id" SERIAL NOT NULL,
            "name" character varying NOT NULL,
            "sla_first_response_hours" integer NOT NULL,
            "sla_resolution_hours" integer NOT NULL,
            CONSTRAINT "PK_ticket_priorities_id" PRIMARY KEY ("id")
        )`);

        // Create category_priority_sla table
        await queryRunner.query(`CREATE TABLE "category_priority_sla" (
            "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
            "category_id" uuid NOT NULL,
            "priority_id" integer NOT NULL,
            "sla_first_response_hours" integer NOT NULL,
            "sla_resolution_hours" integer NOT NULL,
            CONSTRAINT "PK_category_priority_sla_id" PRIMARY KEY ("id")
        )`);

        // Create ticket_status table
        await queryRunner.query(`CREATE TABLE "ticket_status" (
            "id" SERIAL NOT NULL,
            "name" character varying NOT NULL,
            "is_final" boolean NOT NULL DEFAULT false,
            CONSTRAINT "PK_ticket_status_id" PRIMARY KEY ("id")
        )`);

        // Create tickets table
        await queryRunner.query(`CREATE TABLE "tickets" (
            "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
            "title" character varying NOT NULL,
            "description" text NOT NULL,
            "requester_id" uuid NOT NULL,
            "category_id" uuid NOT NULL,
            "status_id" integer NOT NULL,
            "priority_id" integer NOT NULL,
            "assigned_to_id" uuid,
            "category_name_snapshot" character varying NOT NULL,
            "priority_name_snapshot" character varying NOT NULL,
            "sla_first_response_hours_snapshot" integer NOT NULL,
            "sla_resolution_hours_snapshot" integer NOT NULL,
            "sla_first_response_due" TIMESTAMP,
            "sla_resolution_due" TIMESTAMP,
            "created_at" TIMESTAMP NOT NULL DEFAULT now(),
            "updated_at" TIMESTAMP NOT NULL DEFAULT now(),
            CONSTRAINT "PK_tickets_id" PRIMARY KEY ("id")
        )`);

        // Create ticket_field_values table
        await queryRunner.query(`CREATE TABLE "ticket_field_values" (
            "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
            "ticket_id" uuid NOT NULL,
            "field_id" uuid NOT NULL,
            "value" text,
            CONSTRAINT "PK_ticket_field_values_id" PRIMARY KEY ("id")
        )`);

        // Create ticket_transitions table
        await queryRunner.query(`CREATE TABLE "ticket_transitions" (
            "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
            "ticket_id" uuid NOT NULL,
            "previous_status_id" integer NOT NULL,
            "new_status_id" integer NOT NULL,
            "changed_by_id" uuid NOT NULL,
            "changed_at" TIMESTAMP NOT NULL,
            CONSTRAINT "PK_ticket_transitions_id" PRIMARY KEY ("id")
        )`);

        // Create ticket_comments table
        await queryRunner.query(`CREATE TABLE "ticket_comments" (
            "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
            "ticket_id" uuid NOT NULL,
            "author_id" uuid NOT NULL,
            "comment" text NOT NULL,
            "created_at" TIMESTAMP NOT NULL DEFAULT now(),
            CONSTRAINT "PK_ticket_comments_id" PRIMARY KEY ("id")
        )`);

        // Create sla_alerts table
        await queryRunner.query(`CREATE TABLE "sla_alerts" (
            "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
            "ticket_id" uuid NOT NULL,
            "alert_type" "public"."sla_alerts_alert_type_enum" NOT NULL,
            "triggered_at" TIMESTAMP NOT NULL,
            "resolved" boolean NOT NULL DEFAULT false,
            CONSTRAINT "PK_sla_alerts_id" PRIMARY KEY ("id")
        )`);

        // Add foreign key constraints
        await queryRunner.query(`ALTER TABLE "categories" ADD CONSTRAINT "FK_categories_created_by_id" FOREIGN KEY ("created_by_id") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "category_fields" ADD CONSTRAINT "FK_category_fields_category_id" FOREIGN KEY ("category_id") REFERENCES "categories"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "category_priority_sla" ADD CONSTRAINT "FK_category_priority_sla_category_id" FOREIGN KEY ("category_id") REFERENCES "categories"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "category_priority_sla" ADD CONSTRAINT "FK_category_priority_sla_priority_id" FOREIGN KEY ("priority_id") REFERENCES "ticket_priorities"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "tickets" ADD CONSTRAINT "FK_tickets_requester_id" FOREIGN KEY ("requester_id") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "tickets" ADD CONSTRAINT "FK_tickets_assigned_to_id" FOREIGN KEY ("assigned_to_id") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "tickets" ADD CONSTRAINT "FK_tickets_category_id" FOREIGN KEY ("category_id") REFERENCES "categories"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "tickets" ADD CONSTRAINT "FK_tickets_status_id" FOREIGN KEY ("status_id") REFERENCES "ticket_status"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "tickets" ADD CONSTRAINT "FK_tickets_priority_id" FOREIGN KEY ("priority_id") REFERENCES "ticket_priorities"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "ticket_field_values" ADD CONSTRAINT "FK_ticket_field_values_ticket_id" FOREIGN KEY ("ticket_id") REFERENCES "tickets"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "ticket_field_values" ADD CONSTRAINT "FK_ticket_field_values_field_id" FOREIGN KEY ("field_id") REFERENCES "category_fields"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "ticket_transitions" ADD CONSTRAINT "FK_ticket_transitions_ticket_id" FOREIGN KEY ("ticket_id") REFERENCES "tickets"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "ticket_transitions" ADD CONSTRAINT "FK_ticket_transitions_previous_status_id" FOREIGN KEY ("previous_status_id") REFERENCES "ticket_status"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "ticket_transitions" ADD CONSTRAINT "FK_ticket_transitions_new_status_id" FOREIGN KEY ("new_status_id") REFERENCES "ticket_status"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "ticket_transitions" ADD CONSTRAINT "FK_ticket_transitions_changed_by_id" FOREIGN KEY ("changed_by_id") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "ticket_comments" ADD CONSTRAINT "FK_ticket_comments_ticket_id" FOREIGN KEY ("ticket_id") REFERENCES "tickets"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "ticket_comments" ADD CONSTRAINT "FK_ticket_comments_author_id" FOREIGN KEY ("author_id") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "sla_alerts" ADD CONSTRAINT "FK_sla_alerts_ticket_id" FOREIGN KEY ("ticket_id") REFERENCES "tickets"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        // Drop foreign key constraints
        await queryRunner.query(`ALTER TABLE "sla_alerts" DROP CONSTRAINT "FK_sla_alerts_ticket_id"`);
        await queryRunner.query(`ALTER TABLE "ticket_comments" DROP CONSTRAINT "FK_ticket_comments_author_id"`);
        await queryRunner.query(`ALTER TABLE "ticket_comments" DROP CONSTRAINT "FK_ticket_comments_ticket_id"`);
        await queryRunner.query(`ALTER TABLE "ticket_transitions" DROP CONSTRAINT "FK_ticket_transitions_changed_by_id"`);
        await queryRunner.query(`ALTER TABLE "ticket_transitions" DROP CONSTRAINT "FK_ticket_transitions_new_status_id"`);
        await queryRunner.query(`ALTER TABLE "ticket_transitions" DROP CONSTRAINT "FK_ticket_transitions_previous_status_id"`);
        await queryRunner.query(`ALTER TABLE "ticket_transitions" DROP CONSTRAINT "FK_ticket_transitions_ticket_id"`);
        await queryRunner.query(`ALTER TABLE "ticket_field_values" DROP CONSTRAINT "FK_ticket_field_values_field_id"`);
        await queryRunner.query(`ALTER TABLE "ticket_field_values" DROP CONSTRAINT "FK_ticket_field_values_ticket_id"`);
        await queryRunner.query(`ALTER TABLE "tickets" DROP CONSTRAINT "FK_tickets_priority_id"`);
        await queryRunner.query(`ALTER TABLE "tickets" DROP CONSTRAINT "FK_tickets_status_id"`);
        await queryRunner.query(`ALTER TABLE "tickets" DROP CONSTRAINT "FK_tickets_category_id"`);
        await queryRunner.query(`ALTER TABLE "tickets" DROP CONSTRAINT "FK_tickets_assigned_to_id"`);
        await queryRunner.query(`ALTER TABLE "tickets" DROP CONSTRAINT "FK_tickets_requester_id"`);
        await queryRunner.query(`ALTER TABLE "category_priority_sla" DROP CONSTRAINT "FK_category_priority_sla_priority_id"`);
        await queryRunner.query(`ALTER TABLE "category_priority_sla" DROP CONSTRAINT "FK_category_priority_sla_category_id"`);
        await queryRunner.query(`ALTER TABLE "category_fields" DROP CONSTRAINT "FK_category_fields_category_id"`);
        await queryRunner.query(`ALTER TABLE "categories" DROP CONSTRAINT "FK_categories_created_by_id"`);

        // Drop tables
        await queryRunner.query(`DROP TABLE "sla_alerts"`);
        await queryRunner.query(`DROP TABLE "ticket_comments"`);
        await queryRunner.query(`DROP TABLE "ticket_transitions"`);
        await queryRunner.query(`DROP TABLE "ticket_field_values"`);
        await queryRunner.query(`DROP TABLE "tickets"`);
        await queryRunner.query(`DROP TABLE "ticket_status"`);
        await queryRunner.query(`DROP TABLE "category_priority_sla"`);
        await queryRunner.query(`DROP TABLE "ticket_priorities"`);
        await queryRunner.query(`DROP TABLE "category_fields"`);
        await queryRunner.query(`DROP TABLE "categories"`);
        await queryRunner.query(`DROP TABLE "users"`);

        // Drop enums
        await queryRunner.query(`DROP TYPE "public"."sla_alerts_alert_type_enum"`);
        await queryRunner.query(`DROP TYPE "public"."category_fields_field_type_enum"`);
        await queryRunner.query(`DROP TYPE "public"."users_role_enum"`);
    }

}
