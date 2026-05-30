import logging
import sys

def setup_logger(name: str = "time_scheduler_api") -> logging.Logger:
    logger = logging.getLogger(name)
    
    logger.setLevel(logging.DEBUG)

    if not logger.handlers:
        console_handler = logging.StreamHandler(sys.stdout)
        
        log_format = logging.Formatter(
            fmt="%(asctime)s | %(levelname)-8s | %(name)s | %(message)s",
            datefmt="%Y-%m-%d %H:%M:%S"
        )
        
        console_handler.setFormatter(log_format)
        logger.addHandler(console_handler)

    return logger

logger = setup_logger()