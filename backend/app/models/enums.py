import enum

class RoleEnum(str, enum.Enum):
    MANAGER = "manager"
    STAFF = "staff"
    WAREHOUSE = "warehouse"
    SECURITY = "security"


class ScheduleStatus(str, enum.Enum):
    PENDING = "pending"
    RUNNING = "running"
    COMPLETED = "completed"
    FAILED = "failed"

class SchedulingAlgorithm(str, enum.Enum):
    GREEDY = "greedy"
