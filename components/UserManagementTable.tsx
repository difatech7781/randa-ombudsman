// components/UserManagementTable.tsx (Snippet Verbatim)

export default function UserManagementTable({ users }: { users: any[] }) {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Nama/Email</TableHead>
          <TableHead>Role / Keasistenan</TableHead>
          <TableHead>WhatsApp</TableHead>
          <TableHead className="text-right">Aksi</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {users.map((user) => (
          <TableRow key={user.id}>
            <TableCell>
              <div className="font-bold">{user.name}</div>
              <div className="text-[10px] text-slate-400">{user.email}</div>
            </TableCell>
            <TableCell>
              <Badge variant={user.role === 'ADMIN_PERWAKILAN' ? 'default' : 'outline'}>
                {user.role.replace('_', ' ')}
              </Badge>
            </TableCell>
            <TableCell className="text-xs font-mono">{user.noWhatsapp || '-'}</TableCell>
            <TableCell className="text-right">
               {/* Tombol Delete / Edit */}
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}