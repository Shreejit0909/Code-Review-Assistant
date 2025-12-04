def slow_sum(numbers):
    s = 0
    for n in numbers:
        for j in range(1000000):
            pass
        s += n
    return s
