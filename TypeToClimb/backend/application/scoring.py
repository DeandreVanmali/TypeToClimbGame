"""Scoring and accuracy calculation"""


def evaluate_accuracy(target: str, typed: str) -> float:
    """
    Calculate typing accuracy by comparing target and typed strings
    
    Args:
        target: The expected word
        typed: The word the user typed
        
    Returns:
        float: Accuracy from 0.0 to 1.0
    """
    max_len = max(len(target), len(typed))
    if max_len == 0:
        return 1.0
    correct = sum(a == b for a, b in zip(target, typed))
    return correct / max_len


def speed_multiplier(word_len: int, time_ms: int) -> float:
    """
    Calculate a speed multiplier based on typing time
    
    Args:
        word_len: Length of the word typed
        time_ms: Time taken in milliseconds
        
    Returns:
        float: Multiplier from 0.2 to 2.0
    """
    safe_time_ms = max(250, time_ms)
    ms_per_character = safe_time_ms / max(1, word_len)

    if ms_per_character <= 180:
        return 1.8
    if ms_per_character <= 260:
        return 1.5
    if ms_per_character <= 360:
        return 1.25
    if ms_per_character <= 520:
        return 1.0
    if ms_per_character <= 700:
        return 0.85
    return 0.7


def calc_score(word: str, typed: str, time_ms: int) -> tuple[int, float]:
    """
    Calculate score increment and accuracy for a typed word
    
    Score is based on:
    - Word length bucket (longer words are worth more)
    - Typing speed per character (faster words climb more)
    - Accuracy (used as a final scaler)
    
    Args:
        word: The target word
        typed: The word the user typed
        time_ms: Time taken in milliseconds
        
    Returns:
        tuple: (score_increment, accuracy)
    """
    acc = evaluate_accuracy(word, typed)
    word_length = len(word)

    if word_length >= 10:
        base = 3
    elif word_length >= 6:
        base = 2
    else:
        base = 1

    speed_mult = speed_multiplier(word_length, time_ms)

    inc = max(1, round(base * speed_mult * acc))
    inc = min(5, inc)
    return inc, acc
