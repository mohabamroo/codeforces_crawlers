def solution(A):
    n = len(A)
    result = 0
    max_res = 0
    for i in range(n - 1):
        if (A[i] == A[i + 1]):
            result = result + 1
    print "result: " , result
    r = 0
    for i in range(n):
        count = 0
        if (i > 0):
            if (A[i - 1] != A[i]):
                count = count + 1
            else:
                count = count - 1
        if (i < n - 1):
            if (A[i + 1] != A[i]):
                count = count + 1
            else:
                count = count - 1
        r = max(r, count)
        print "r: ", r
    return result + r

x = [1, 1, 0, 1, 0, 0]
print solution(x)