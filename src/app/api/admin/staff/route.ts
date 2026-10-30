import { NextRequest, NextResponse } from 'next/server';
import { loadLocalUsers, saveUser, deleteUser, findUserByEmail, StoredUser, StoredUserRole } from '@/lib/authStore';
import bcrypt from 'bcryptjs';

// Verify caller is an active Super Admin
async function verifySuperAdmin(req: NextRequest): Promise<boolean> {
  try {
    const sessionToken = req.cookies.get('digitube_session')?.value;
    if (!sessionToken) return false;

    let userEmail: string | null = null;
    if (sessionToken.includes('::')) {
      userEmail = sessionToken.split('::')[0];
    }
    if (!userEmail) return false;

    const user = await findUserByEmail(userEmail);
    return user?.role === 'SUPER_ADMIN';
  } catch {
    return false;
  }
}

// GET /api/admin/staff - Return staff accounts (Super Admin only)
export async function GET(req: NextRequest) {
  try {
    const isSuperAdmin = await verifySuperAdmin(req);
    if (!isSuperAdmin) {
      return NextResponse.json(
        { success: false, error: 'Access Denied: Super Admin credentials required to inspect staff accounts.' },
        { status: 403 }
      );
    }

    const allUsers = loadLocalUsers();
    const staffRoles = [
      'SUPER_ADMIN',
      'COMPANY_ADMIN',
      'RELEASE_MANAGER',
      'CATALOG_STAFF',
      'ACCOUNTS_STAFF',
      'SUPPORT_STAFF',
    ];

    const staffList = allUsers
      .filter((u) => staffRoles.includes(u.role))
      .map((u) => ({
        id: u.id,
        fullName: u.fullName,
        email: u.email,
        role: u.role,
        assignedScope: u.assignedScope || 'ALL',
        permissions: u.permissions || [],
        isActive: u.verificationStatus === 'ACTIVE',
        mfaEnabled: Boolean(u.mfaEnabled),
        createdAt: u.createdAt,
      }));

    return NextResponse.json({ success: true, staff: staffList });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

// POST /api/admin/staff - Create new staff account with ID and Password (Super Admin only)
export async function POST(req: NextRequest) {
  try {
    const isSuperAdmin = await verifySuperAdmin(req);
    if (!isSuperAdmin) {
      return NextResponse.json(
        { success: false, error: 'Access Denied: Only Super Admin can provision new employee accounts.' },
        { status: 403 }
      );
    }

    const body = await req.json();
    const { fullName, email, password, role, assignedScope } = body;

    if (!fullName || !email || !password || !role) {
      return NextResponse.json(
        { success: false, error: 'Full name, email, password, and role are required.' },
        { status: 400 }
      );
    }

    const cleanEmail = email.toLowerCase().trim();

    // Check if email already registered
    const existingUsers = loadLocalUsers();
    if (existingUsers.some((u) => u.email.toLowerCase() === cleanEmail)) {
      return NextResponse.json(
        { success: false, error: `An account with email "${cleanEmail}" already exists.` },
        { status: 409 }
      );
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(password, salt);

    const newStaffUser: StoredUser = {
      id: `usr_staff_${Date.now()}`,
      email: cleanEmail,
      passwordHash,
      fullName: fullName.trim(),
      stageName: fullName.trim(),
      role: role as StoredUserRole,
      assignedScope: assignedScope || 'ALL',
      permissions: [
        'releases.view',
        role === 'RELEASE_MANAGER' || role === 'SUPER_ADMIN' ? 'releases.approve' : '',
        role === 'ACCOUNTS_STAFF' || role === 'SUPER_ADMIN' ? 'royalties.payout' : '',
        role === 'SUPPORT_STAFF' ? 'support.tickets' : '',
      ].filter(Boolean),
      verificationStatus: 'ACTIVE',
      mfaEnabled: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    await saveUser(newStaffUser);

    return NextResponse.json({
      success: true,
      message: 'Staff account created successfully.',
      staff: {
        id: newStaffUser.id,
        fullName: newStaffUser.fullName,
        email: newStaffUser.email,
        role: newStaffUser.role,
        assignedScope: newStaffUser.assignedScope,
        permissions: newStaffUser.permissions,
        isActive: true,
        mfaEnabled: true,
        createdAt: newStaffUser.createdAt,
      },
    });
  } catch (error: any) {
    console.error('Error creating staff account:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to create staff account.' },
      { status: 500 }
    );
  }
}

// DELETE /api/admin/staff - Delete staff account (Super Admin only, cannot delete other Super Admins)
export async function DELETE(req: NextRequest) {
  try {
    const isSuperAdmin = await verifySuperAdmin(req);
    if (!isSuperAdmin) {
      return NextResponse.json(
        { success: false, error: 'Access Denied: Only Super Admin can revoke employee credentials.' },
        { status: 403 }
      );
    }

    const { searchParams } = new URL(req.url);
    const email = searchParams.get('email');

    if (!email) {
      return NextResponse.json({ success: false, error: 'Email is required.' }, { status: 400 });
    }

    const cleanEmail = email.toLowerCase().trim();
    const targetUser = await findUserByEmail(cleanEmail);
    if (targetUser?.role === 'SUPER_ADMIN') {
      return NextResponse.json(
        { success: false, error: 'Security Protection: Super Admin accounts cannot be deleted through this interface.' },
        { status: 403 }
      );
    }

    await deleteUser(cleanEmail);
    return NextResponse.json({ success: true, message: `Staff member ${cleanEmail} removed.` });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
