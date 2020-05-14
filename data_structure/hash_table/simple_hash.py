def make_hash(value: str):
    hashsum = 0
    for c in value:
        # Add unicode value
        hashsum += ord(c)

    return f"0x{hashsum:x}"


if __name__ == "__main__":
    print(make_hash("hello"))
    print(make_hash("idmko"))
