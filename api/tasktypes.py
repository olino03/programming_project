from enum import IntEnum


class TaskTypeEnum(IntEnum):
    YOUR_TASKS = 0,
    FINISHED_TASKS = 1,
    AVAILABLE_TASKS = 2,
    ONGOING_TASKS = 3,
