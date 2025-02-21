"use client";

import { ColumnDef } from "@tanstack/react-table";
import clsx from "clsx";
import { Button } from "@/components/ui/button";
import { ThumbsUp, ThumbsDown } from "lucide-react";
import { useState } from "react";
import { toast } from "react-hot-toast";
import { DataTableColumnHeader } from "@/components/WalletTable/data-table-column-header";
import { DataTableRowActions } from "@/components/WalletTable/data-table-row-actions";
import { Avatar, AvatarFallback, AvatarImage } from "@radix-ui/react-avatar";

import { Wallet } from "@/types/wallet";
import { usersStatus } from "./definitions";

export const columns: ColumnDef<Wallet>[] = [
  {
    accessorKey: "rank",
    header: ({ column }) => <DataTableColumnHeader column={column} title={"Rank"} />,
    cell: ({ row, table }) => {
      // Get all rows sorted by vote difference
      const sortedRows = [...table.getPreFilteredRowModel().rows].sort((a, b) => {
        const aVotes = a.original.votes || { notScammer: 0, scammer: 0 };
        const bVotes = b.original.votes || { notScammer: 0, scammer: 0 };
        const aScore = (aVotes.notScammer || 0) - (aVotes.scammer || 0);
        const bScore = (bVotes.notScammer || 0) - (bVotes.scammer || 0);
        return bScore - aScore;
      });
      
      const rank = sortedRows.findIndex(r => r.id === row.id) + 1;
      
      return <div className="text-center">{rank}</div>;
    },
    sortingFn: (rowA, rowB) => {
      const aVotes = rowA.original.votes || { notScammer: 0, scammer: 0 };
      const bVotes = rowB.original.votes || { notScammer: 0, scammer: 0 };
      const aScore = (aVotes.notScammer || 0) - (aVotes.scammer || 0);
      const bScore = (bVotes.notScammer || 0) - (bVotes.scammer || 0);
      return bScore - aScore;
    },
    sortDescFirst: true,
  },
  {
    accessorKey: "profilePic",
    header: () => <h1>Trader</h1>,
    cell: ({ row }) => {
      const userName = row.original.userName;
      const wallet = row.original.address;
      return (
        <div className="flex items-center gap-2">
          <Avatar>
            <AvatarImage src={`https://avatar.iran.liara.run/username?username=${userName}`} alt="Profile Pic" width={32} height={32}/>
            <AvatarFallback>{userName.slice(0, 2)}</AvatarFallback>
          </Avatar>
          <div className="flex flex-col items-start truncate">
            <h1 className="font-medium">{userName}</h1>
            <h1 className="text-sm text-gray-500 truncate">{wallet.slice(0, 6)}...{wallet.slice(-6)}</h1>
          </div>
        </div>
      );
    },
  },
  {
    accessorKey: "followers",
    header: ({ column }) => <DataTableColumnHeader column={column} title={"Followers"} />,
    cell: ({ row }) => {
      const followers = row.original.followers;
      const xHandle = row.original.xHandle;
      return (
        <div className="flex flex-col items-center gap-2">
          <div className="text-center">{followers}</div>
          <div className="text-center">{xHandle}</div>
        </div>
      );
    },
  },
  {
    accessorKey: "tokenCount",
    header: ({ column }) => <DataTableColumnHeader column={column} title={"Tokens"} />,
  },
  {
    accessorKey: "winRate",
    header: ({ column }) => <DataTableColumnHeader column={column} title={"Win Rate"} />,
  },
  {
    accessorKey: "trades",
    header: ({ column }) => <DataTableColumnHeader column={column} title={"Trades"} />,
    cell: ({ row }) => {
      const trades = row.original.trades;
      return (
        <div className="flex flex-col items-center gap-1">
          <div className="flex items-center gap-2">
            <span className="text-green-500">{trades?.buys} Buys</span>
            <span> / </span>
            <span className="text-red-500">{trades?.sells} Sells</span>
          </div>
        </div>
      );
    },
  },
  {
    accessorKey: "avgBuy",
    header: ({ column }) => <DataTableColumnHeader column={column} title={"Avg Buy"} />,
  },
  {
    accessorKey: "avgHold",
    header: ({ column }) => <DataTableColumnHeader column={column} title={"Avg Hold"} />,
  },
  {
    accessorKey: "pnl",
    header: ({ column }) => <DataTableColumnHeader column={column} title={"Realized PnL"} />,
    filterFn: (row, id, value: string[]) => {
      if (!value.length) return true;
      const pnl = row.getValue(id) as number;
      return value.some((v) => {
        if (v === "positive") return pnl >= 0;
        if (v === "negative") return pnl < 0;
        return false;
      });
    },
  },
  {
    accessorKey: "wallet",
    header: ({ column }) => <DataTableColumnHeader column={column} title={"Wallet"} />,
    cell: ({ row }) => {
      const wallet = row.original.address;
      return (
        <div className="text-center">{wallet.slice(0, 6)}...{wallet.slice(-6)}</div>
      );
    },
  },
  {
    accessorKey: "xHandle",
    header: ({ column }) => <DataTableColumnHeader column={column} title={"X Handle"} />,
    cell: ({ row }) => {
      const xHandle = row.original.xHandle;
      return (
        <div className="text-center">{xHandle}</div>
      );
    },
    filterFn: (row, id, filterValue) => {
      const searchValue = (filterValue as string).toLowerCase();
      const xHandle = String(row.getValue("xHandle")).toLowerCase();
      const wallet = String(row.getValue("wallet")).toLowerCase();
      return xHandle.includes(searchValue) || wallet.includes(searchValue);
    }
  },
  {
    accessorKey: "status",
    header: ({ column }) => <DataTableColumnHeader column={column} title={"Status"} />,
    cell: ({ row }) => {
      const status = usersStatus.find((status) => status.value === row.getValue("status"));

      if (!status) {
        return null;
      }

      return (
        <div
          className={clsx("flex w-[100px] items-center", {
            "text-red-500": status.value === "inactive",
            "text-green-500": status.value === "active",
          })}>
          {status.icon && <status.icon className="mr-2 h-4 w-4 text-muted-foreground" />}
          <span>{status.label}</span>
        </div>
      );
    },
    filterFn: (row, id, value) => {
      return value.includes(row.getValue(id));
    },
  },
  {
    id: "globalSearch",
    enableHiding: false,
    filterFn: (row, id, filterValue) => {
      const searchValue = (filterValue as string).toLowerCase();
      const xHandle = String(row.getValue("xHandle")).toLowerCase();
      const wallet = String(row.getValue("wallet")).toLowerCase();
      return xHandle.includes(searchValue) || wallet.includes(searchValue);
    }
  },
  {
    id: "votes",
    header: ({ column }) => <DataTableColumnHeader column={column} title="Votes" />,
    cell: ({ row }) => {
      const [isVoting, setIsVoting] = useState(false);
      const wallet = row.original;
      
      const handleVote = async (voteType: "scammer" | "notScammer") => {
        if (isVoting) return;
        
        setIsVoting(true);
        try {
          const response = await fetch("/api/vote", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              address: wallet.address,
              vote: voteType,
            }),
          });
          
          const data = await response.json();
          
          if (!response.ok) {
            throw new Error(data.error || "Vote failed");
          }
          
          // Update the local state optimistically
          const newVotes = {
            scammer: (wallet.votes?.scammer || 0) + (voteType === "scammer" ? 1 : 0),
            notScammer: (wallet.votes?.notScammer || 0) + (voteType === "notScammer" ? 1 : 0)
          };
          row.original.votes = newVotes;
          
          toast.success(`Successfully voted ${voteType === "scammer" ? "down" : "up"}`);
          
        } catch (error) {
          console.error("Error voting:", error);
          toast.error("Failed to record vote");
        } finally {
          setIsVoting(false);
        }
      };

      return (
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => handleVote("notScammer")}
            disabled={isVoting}
            className="text-green-500 hover:text-green-700"
          >
            <ThumbsUp className="h-4 w-4" />
            <span className="ml-1">{wallet.votes?.notScammer || 0}</span>
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => handleVote("scammer")}
            disabled={isVoting}
            className="text-red-500 hover:text-red-700"
          >
            <ThumbsDown className="h-4 w-4" />
            <span className="ml-1">{wallet.votes?.scammer || 0}</span>
          </Button>
        </div>
      );
    },
  },
  {
    id: "actions",
    cell: ({ row }) => <DataTableRowActions row={row} />,
  },
];
