def activity_selection(activities):
    # activities: list of (start, end) tuples
    activities.sort(key=lambda x: x[1])
    selected = []
    last_end = -1
    for start, end in activities:
        if start >= last_end:
            selected.append((start, end))
            last_end = end
    return selected 