# Backend Fix Required for Leaderboard Websockets

## Critical Bug in leaderController.js

### Issue Location: Line 107

**Current Code (BROKEN):**
```javascript
const beginnerLeaderboard = await User.find({ field: 'user', difficulty: user.difficulty })
```

**Problem:** 
- Variable `user` is **undefined** at this point
- This causes the query to fail silently
- No beginner leaderboard data is emitted via websockets

### Fix Required:

**Replace line 107 with:**
```javascript
const beginnerLeaderboard = await User.find({ field: 'user', difficulty: 'beginner' })
```

### Complete Fixed Function:

```javascript
const emitLeaderboardUpdate = async (updatedUserId = null) => {
  if (!io) {
    console.log('⚠️ Socket.IO not initialized');
    return;
  }

  try {
    // Fetch and emit BEGINNER leaderboard
    const beginnerLeaderboard = await User.find({ field: 'user', difficulty: 'beginner' })  // ✅ FIXED
      .select('team_name point solved_no difficulty createdAt')
      .sort({ point: -1, solved_no: -1, createdAt: 1 });

    const rankedBeginnerLeaderboard = beginnerLeaderboard.map((user, index) => ({
      rank: index + 1,
      team_name: user.team_name,
      points: user.point,
      solved_count: user.solved_no,
      difficulty: user.difficulty,
      user_id: user._id.toString()
    }));

    // Emit beginner leaderboard
    io.emit('leaderboard_update_beginner', {
      leaderboard: rankedBeginnerLeaderboard,
      difficulty: 'beginner',
      timestamp: new Date().toISOString(),
      updated_user: updatedUserId
    });

    // Fetch and emit INTERMEDIATE leaderboard
    const intermediateLeaderboard = await User.find({ field: 'user', difficulty: 'intermediate' })
      .select('team_name point solved_no difficulty createdAt')
      .sort({ point: -1, solved_no: -1, createdAt: 1 });

    const rankedIntermediateLeaderboard = intermediateLeaderboard.map((user, index) => ({
      rank: index + 1,
      team_name: user.team_name,
      points: user.point,
      solved_count: user.solved_no,
      difficulty: user.difficulty,
      user_id: user._id.toString()
    }));

    // Emit intermediate leaderboard
    io.emit('leaderboard_update_intermediate', {
      leaderboard: rankedIntermediateLeaderboard,
      difficulty: 'intermediate',
      timestamp: new Date().toISOString(),
      updated_user: updatedUserId
    });

    // If specific user updated, emit their new rank within their difficulty level
    if (updatedUserId) {
      const userRank = await getUserRank(updatedUserId);
      if (userRank) {
        io.emit('user_rank_change', {
          user_id: updatedUserId,
          new_rank: userRank.rank,
          points: userRank.points,
          team_name: userRank.team_name,
          difficulty: userRank.difficulty,
          timestamp: new Date().toISOString()
        });
      }
    }

    console.log(`✅ Leaderboard updates emitted for both difficulty levels`);
  } catch (error) {
    console.error('❌ Error emitting leaderboard update:', error);
  }
};
```

## When to Call emitLeaderboardUpdate

Make sure to call this function in your submission controller after a correct answer:

```javascript
// In your submission controller after updating user points
if (isCorrect) {
  // Update user points and solved count
  user.point += question.point;
  user.solved_no += 1;
  await user.save();
  
  // ✅ Emit leaderboard update to all connected clients
  await emitLeaderboardUpdate(user._id.toString());
  
  // Also emit new solve notification
  await emitNewSolve(user._id.toString(), question.title, question.point);
}
```

## How to Verify the Fix Works

1. Apply the fix to line 107 in leaderController.js
2. Restart your backend server
3. Open browser console on frontend
4. You should see these logs:
   - `🔌 Leaderboard: Connecting websocket with token: present`
   - `✅ Leaderboard: Socket connected successfully`
   - `📥 Leaderboard: Received websocket update:` (when someone submits)
   - `✅ Leaderboard: Setting X users`

5. Test by:
   - Opening leaderboard page in two browser tabs
   - Submitting a correct answer in one tab
   - Both tabs should update in real-time with new rankings and team names

## Frontend Changes Already Applied

✅ Fixed team name display (using `team_name` field)
✅ Added detailed console logging for debugging
✅ Normalized payload handling for both REST and websocket
✅ Fixed difficulty-specific leaderboard fetching after submission

The frontend is now ready - just needs the backend fix!
