import userReducer, {
  loginUser,
  registerUser,
  checkUserAuth,
  logoutUser,
  clearError
} from './userSlice';

const mockUser = {
  name: 'Test User',
  email: 'test@example.com'
} as any;

describe('userSlice reducer', () => {
  // ---------- loginUser ----------
  it('ставит флаг загрузки в true и очищает ошибку при loginUser.pending', () => {
    const state = userReducer(undefined, {
      type: loginUser.pending.type
    } as any);

    expect((state as any).loading).toBe(true);
    expect((state as any).error).toBeUndefined();
  });

  it('сохраняет пользователя, выставляет isAuth и сбрасывает загрузку при loginUser.fulfilled', () => {
    const loadingState = userReducer(undefined, {
      type: loginUser.pending.type
    } as any);

    const state = userReducer(loadingState, {
      type: loginUser.fulfilled.type,
      payload: mockUser
    } as any);

    expect((state as any).loading).toBe(false);
    expect((state as any).user).toEqual(mockUser);
    expect((state as any).isAuth).toBe(true);
    expect((state as any).error).toBeUndefined();
  });

  it('сохраняет ошибку и сбрасывает загрузку при loginUser.rejected', () => {
    const loadingState = userReducer(undefined, {
      type: loginUser.pending.type
    } as any);

    const errorMessage = 'Login failed';

    const state = userReducer(loadingState, {
      type: loginUser.rejected.type,
      error: { message: errorMessage }
    } as any);

    expect((state as any).loading).toBe(false);
    expect((state as any).error).toBe(errorMessage);
    // isAuth по коду не меняется, но начальное значение false — можно дополнительно проверить
    expect((state as any).isAuth).toBe(false);
  });

  // ---------- registerUser ----------
  it('ставит флаг загрузки в true и очищает ошибку при registerUser.pending', () => {
    const state = userReducer(undefined, {
      type: registerUser.pending.type
    } as any);

    expect((state as any).loading).toBe(true);
    expect((state as any).error).toBeUndefined();
  });

  it('сохраняет пользователя и isAuth при registerUser.fulfilled', () => {
    const loadingState = userReducer(undefined, {
      type: registerUser.pending.type
    } as any);

    const state = userReducer(loadingState, {
      type: registerUser.fulfilled.type,
      payload: mockUser
    } as any);

    expect((state as any).loading).toBe(false);
    expect((state as any).user).toEqual(mockUser);
    expect((state as any).isAuth).toBe(true);
  });

  // ---------- checkUserAuth ----------
  it('ставит флаг загрузки в true при checkUserAuth.pending', () => {
    const state = userReducer(undefined, {
      type: checkUserAuth.pending.type
    } as any);

    expect((state as any).loading).toBe(true);
  });

  it('сохраняет пользователя и isAuth при checkUserAuth.fulfilled', () => {
    const loadingState = userReducer(undefined, {
      type: checkUserAuth.pending.type
    } as any);

    const state = userReducer(loadingState, {
      type: checkUserAuth.fulfilled.type,
      payload: mockUser
    } as any);

    expect((state as any).loading).toBe(false);
    expect((state as any).user).toEqual(mockUser);
    expect((state as any).isAuth).toBe(true);
  });

  it('сбрасывает пользователя и isAuth при checkUserAuth.rejected', () => {
    const loadingState = userReducer(undefined, {
      type: checkUserAuth.pending.type
    } as any);

    const state = userReducer(loadingState, {
      type: checkUserAuth.rejected.type
    } as any);

    expect((state as any).loading).toBe(false);
    expect((state as any).user).toBeNull();
    expect((state as any).isAuth).toBe(false);
  });

  // ---------- logoutUser ----------
  it('обнуляет пользователя и isAuth при logoutUser.fulfilled', () => {
    const authedState = {
      user: mockUser,
      isAuth: true,
      loading: false,
      error: undefined
    };

    const state = userReducer(
      authedState as any,
      {
        type: logoutUser.fulfilled.type
      } as any
    );

    expect((state as any).user).toBeNull();
    expect((state as any).isAuth).toBe(false);
    expect((state as any).error).toBeUndefined();
  });

  // ---------- clearError (обычный reducer) ----------
  it('очищает error при clearError', () => {
    const errorState = {
      user: null,
      isAuth: false,
      loading: false,
      error: 'Something went wrong'
    };

    const state = userReducer(errorState as any, clearError());

    expect((state as any).error).toBeUndefined();
  });
});
