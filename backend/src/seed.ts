import { DataSource } from 'typeorm';
import { User, UserRole } from './entities/user.entity';
import { TicketPriority } from './entities/ticket-priority.entity';
import { TicketStatus } from './entities/ticket-status.entity';
import { Category } from './entities/category.entity';
import { Ticket } from './entities/ticket.entity';
import { CategoryField } from './entities/category-field.entity';
import { CategoryPrioritySla } from './entities/category-priority-sla.entity';
import { SlaAlert } from './entities/sla-alert.entity';
import { TicketComment } from './entities/ticket-comment.entity';
import { TicketFieldValue } from './entities/ticket-field-value.entity';
import { TicketTransition } from './entities/ticket-transition.entity';
import * as bcrypt from 'bcrypt';

const AppDataSource = new DataSource({
  type: 'postgres',
  host: process.env.DB_HOST || 'localhost',
  port: 5432,
  username: process.env.DB_USERNAME || 'postgres',
  password: process.env.DB_PASSWORD || '1234',
  database: process.env.DB_NAME || 'servicedeskpro',
  entities: [
    User,
    TicketPriority,
    TicketStatus,
    Category,
    Ticket,
    CategoryField,
    CategoryPrioritySla,
    SlaAlert,
    TicketComment,
    TicketFieldValue,
    TicketTransition,
  ],
  synchronize: false,
});

async function seed() {
  try {
    await AppDataSource.initialize();
    console.log('Database connection established');

    // Create admin user
    const adminUser = new User();
    adminUser.name = 'Admin User';
    adminUser.email = 'admin@servicedesk.com';
    adminUser.password_hash = await bcrypt.hash('admin123', 10);
    adminUser.role = UserRole.MANAGER;
    await AppDataSource.manager.save(adminUser);
    console.log('Admin user created');

    // Create agent user
    const agentUser = new User();
    agentUser.name = 'Agent User';
    agentUser.email = 'agent@servicedesk.com';
    agentUser.password_hash = await bcrypt.hash('agent123', 10);
    agentUser.role = UserRole.AGENT;
    await AppDataSource.manager.save(agentUser);
    console.log('Agent user created');

    // Create requester user
    const requesterUser = new User();
    requesterUser.name = 'John Requester';
    requesterUser.email = 'john@example.com';
    requesterUser.password_hash = await bcrypt.hash('user123', 10);
    requesterUser.role = UserRole.REQUESTER;
    await AppDataSource.manager.save(requesterUser);
    console.log('Requester user created');

    // Create ticket priorities
    const priorities = [
      { name: 'Low', sla_first_response_hours: 24, sla_resolution_hours: 72 },
      { name: 'Medium', sla_first_response_hours: 8, sla_resolution_hours: 24 },
      { name: 'High', sla_first_response_hours: 4, sla_resolution_hours: 12 },
      { name: 'Critical', sla_first_response_hours: 1, sla_resolution_hours: 4 },
    ];

    for (const priorityData of priorities) {
      const priority = new TicketPriority();
      Object.assign(priority, priorityData);
      await AppDataSource.manager.save(priority);
    }
    console.log('Ticket priorities created');

    // Create ticket statuses
    const statuses = [
      { name: 'New', is_final: false },
      { name: 'In Progress', is_final: false },
      { name: 'Pending Customer', is_final: false },
      { name: 'Resolved', is_final: true },
      { name: 'Closed', is_final: true },
    ];

    for (const statusData of statuses) {
      const status = new TicketStatus();
      Object.assign(status, statusData);
      await AppDataSource.manager.save(status);
    }
    console.log('Ticket statuses created');

    // Create sample category
    const category = new Category();
    category.name = 'IT Support';
    category.description = 'General IT support requests';
    category.created_by_id = adminUser.id;
    await AppDataSource.manager.save(category);
    console.log('Sample category created');

    console.log('Seed data created successfully!');
  } catch (error) {
    console.error('Error seeding database:', error);
  } finally {
    await AppDataSource.destroy();
  }
}

seed();
