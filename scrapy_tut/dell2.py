def mergesort(A):
    if ( len(A) == 1 ):
        return A

    left = A[0: len(A)/2]
    right = A[len(A)/2: len(A)]

    left = mergesort(left)
    right = mergesort( right )

    return merge(left, right)

def merge(left, right):
    full = [0] * (len(left) + len(right))
    k = -1
    while (len(left) > 0 and len(right) > 0):
        k += 1
        if left[0] > right[0]:
            full[k] = right[0]
            right = right[1:len(right)]
        else:
            full[k] = left[0]
            left = left[1:len(left)]
    while len(left) > 0:
        k += 1
        full[k] = left[0]
        left = left[1:len(right)]
    while len(right) > 0:
        k += 1
        full[k] = right[0]
        right = right[1:len(right)]

    return full

def is_seq(arr, i, j):
    return (arr[j] - arr[i]) <= 1

def right_seq(A):
    min_index = 0
    flag = False
    for x in A:
        min_index += 1
        if is_seq(A, min_index, len(A)-1):
            flag = True
            if min_index == len(A) - 1:
                return 0
            break
        else:
            continue
    
    return len(A) - min_index if flag else 0

def left_seq(A):
    max_index = len(A)
    for i in range(0, len(A)):
        max_index -= 1
        if is_seq(A, 0, max_index):
            break
        else:
            continue
    if max_index < 2:
        return 0
    else:
        return max_index + 1

def left_right_seq(A):
    max_index = len(A)
    min_index = -1
    flag = False
    for i in range(0, len(A)):
        if min_index < max_index:
            max_index -= 1
            min_index += 1
            if is_seq(A, min_index, max_index):
                flag = True
                break
            else:
                continue
    return max_index - min_index + 1 if flag else 0


def solution(A):
    # write your code in Python 3.6
    A = mergesort(A)
    print A
    # for i in range(0, len)
    poss = [left_seq(A), right_seq(A), left_right_seq(A)]
    return max(poss)
    

print solution([10, 6, 6, 7, 9])
print solution([1, 5, 7, 10, 11])
print solution([1, 5, 7, 9, 11])
# print "left: ", left_seq([1, 5, 7, 9, 11])
# print "right: ", right_seq([1, 5, 7, 9, 11])
print solution([1, 8, 55, 8, 8, 20])

print range(5)
