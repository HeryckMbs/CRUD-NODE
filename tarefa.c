
void func3(int *A, int n)
{
    int i, j, aux;
    for (j = 2; j <= n; j++)
    {
        aux = A[j];
        i = j - 1;
        while (i > 0 && A[i] > aux)
        {
            A[i + 1] = A[i];
            i = i - 1;
        }
        A[i + 1] = aux;
    }
}