import random
from faker import Faker
from app.database import SessionLocal
from app.models.employee import Employee
from app.models.enums import RoleEnum
from app.core.security import get_password_hash

from app.core.logger import logger

fake = Faker()

def seed_employees(num_employees=20):
    db = SessionLocal()
    try:
        admin_email = "admin@example.com"
        existing_admin = db.query(Employee).filter(Employee.email == admin_email).first()
        
        if not existing_admin:
            admin = Employee(
                email=admin_email,
                name="System Admin",
                hashed_password=get_password_hash("admin123"),
                full_time_fraction=1.0,
                role=RoleEnum.MANAGER,
                is_admin=True,
                is_active=True
            )
            db.add(admin)
            logger.info(f"Created Admin User: {admin_email} | Password: admin123")
        else:
            logger.warning("Admin user already exists.")

        fractions = [0.5, 0.75, 1.0, 1.0, 1.0] 
        roles = [RoleEnum.MANAGER, RoleEnum.STAFF, RoleEnum.WAREHOUSE, RoleEnum.SECURITY]

        logger.info(f"Generating {num_employees} dummy employees...")
        
        for _ in range(num_employees):
            dummy_employee = Employee(
                email=fake.unique.email(),
                name=fake.name(),
                hashed_password=get_password_hash("password123"),
                full_time_fraction=random.choice(fractions),
                role=random.choice(roles),
                is_admin=False,
                is_active=True
            )
            db.add(dummy_employee)

        db.commit()
        logger.info(f"Successfully inserted {num_employees} employees into the database!")

    except Exception as e:
        logger.error(f"Error seeding database: {e}")
        db.rollback()
    finally:
        db.close()

if __name__ == "__main__":
    logger.info("Starting database seed...")
    seed_employees(20)