"""Word generation and difficulty calculation"""
import random

DIFFICULTY_PROFILES = {"easy", "normal", "hard"}

DIFFICULTY_BANDS_BY_PROFILE = {
    "easy": (1, 2),
    "normal": (2, 3),
    "hard": (3, 5),
}

# Word pool for the typing game
WORD_POOL = [
    "monkey", "parrot", "toucan", "panther", "python", "tiger", "jaguar", "sloth", "macaw", "anaconda",
    "crocodile", "boa", "ocelot", "condor", "serpent", "reptile", "predator", "primate", "feline", "avian",
    "jungle", "rainforest", "forest", "canopy", "treehouse", "bamboo", "orchid", "vines", "vegetation",
    "wilderness", "habitat", "ecosystem", "sanctuary", "thicket", "undergrowth", "foliage", "branches",
    "roots", "moss", "ferns", "shrubs", "exotic", "lush", "dense", "tropical", "moisture", "climate",
    "climb", "vine", "swing", "explore", "discover", "navigate", "traverse", "prowl", "hunt", "roam",
    "leap", "scramble", "venture", "descend", "ascend", "balance", "grip", "cling", "hang", "perch",
    "river", "waterfall", "stream", "lagoon", "pond", "delta", "gorge", "cliff", "ridge", "valley",
    "ravine", "crater", "hollow", "cave", "grotto", "oasis", "wetland", "swamp", "marshland",
    "safari", "wildlife", "nature", "biodiversity", "fauna", "flora", "species", "endangered",
    "conservation", "protect", "preserve", "environment", "season", "monsoon", "humidity",
]


def calculate_difficulty(word_length: int) -> int:
    """
    Calculate difficulty based on word length
    Difficulty ranges from 1-5
    """
    return min(5, max(1, -(-word_length // 3)))  # ceiling division


def pick_word(min_difficulty: int = 1, max_difficulty: int = 5) -> dict:
    """
    Pick a random word from the pool constrained by difficulty range.
    
    Returns:
        dict: {"text": str, "difficulty": int}
    """
    candidates = [
        word
        for word in WORD_POOL
        if min_difficulty <= calculate_difficulty(len(word)) <= max_difficulty
    ]

    if not candidates:
        candidates = WORD_POOL

    text = random.choice(candidates)
    difficulty = calculate_difficulty(len(text))
    return {"text": text, "difficulty": difficulty}


def pick_word_for_difficulty(difficulty_profile: str = "normal") -> dict:
    """Pick a word using a single match-wide difficulty profile."""
    profile = difficulty_profile if difficulty_profile in DIFFICULTY_PROFILES else "normal"
    min_difficulty, max_difficulty = DIFFICULTY_BANDS_BY_PROFILE[profile]
    return pick_word(min_difficulty=min_difficulty, max_difficulty=max_difficulty)

