def compute_stats(numbers):
    total = 0
    for n in numbers:
        total += n

    avg = total / len(numbers)

    mn = min(numbers)
    mx = max(numbers)

    return {
        "total": total,
        "avg": avg,
        "min": mn,
        "max": mx
    }
